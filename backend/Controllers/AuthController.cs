using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.Interfaces;
using AlbanianQuora.Api.Models;
using AlbanianQuora.Api.Security;
using AlbanianQuora.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AlbanianQuora.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenService _jwt;
    private readonly IEmailSender _email;
    private readonly IConfiguration _cfg;

    public AuthController(AppDbContext db, IJwtTokenService jwt, IEmailSender email, IConfiguration cfg)
    {
        _db = db;
        _jwt = jwt;
        _email = email;
        _cfg = cfg;
    }

    // Register

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (req.Password != req.ConfirmPassword)
            return BadRequest(new { message = "ConfirmPassword does not match Password." });

        var email = req.Email.Trim().ToLowerInvariant();
        var username = req.Username.Trim();
        var name = req.Name.Trim();

        if (await _db.Users.AnyAsync(u => u.Email == email))
            return Conflict(new { message = "Email already in use." });

        if (await _db.Users.AnyAsync(u => u.Username == username))
            return Conflict(new { message = "Username already in use." });

        PasswordHasher.CreatePasswordHash(req.Password, out var hash, out var salt);

        var user = new User
        {
            Name = name,
            Username = username,
            Email = email,
            PasswordHash = hash,
            PasswordSalt = salt
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _jwt.CreateToken(user);
        return Ok(new AuthResponse
        {
            AccessToken = token,
            User = new UserMeResponse
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            }
        });
    }

    // Login (STEP 1: password OK -> send OTP, return LoginAttemptId; NO JWT here)

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var input = req.EmailOrUsername.Trim();
        var inputLower = input.ToLowerInvariant();

        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.Email == inputLower || u.Username.ToLower() == inputLower);

        if (user == null)
            return Unauthorized(new { message = "Invalid credentials." });

        var ok = PasswordHasher.VerifyPasswordHash(req.Password, user.PasswordHash, user.PasswordSalt);
        if (!ok)
            return Unauthorized(new { message = "Invalid credentials." });

        // Generate OTP (6-digit)
        var code = OtpService.GenerateCode(); // "123456"
        var salt = OtpService.GenerateSalt(); // byte[]
        var codeHash = OtpService.Hash(code, salt); // byte[]

        var now = DateTime.UtcNow;

        // Invalidate old active OTPs for this user (recommended)
        var active = await _db.LoginOtpTokens
            .Where(t => t.UserId == user.Id &&
                        !t.IsUsed &&
                        !t.IsInvalidated &&
                        t.ExpiresAtUtc > now)
            .ToListAsync();

        foreach (var t in active)
        {
            t.IsInvalidated = true;
            t.InvalidatedAtUtc = now;
        }

        var otpToken = new LoginOtpToken
        {
            UserId = user.Id,
            CodeHash = codeHash,
            Salt = salt,
            ExpiresAtUtc = now.AddMinutes(5),
            IsUsed = false,
            LastSentAtUtc = now,
            ResendCount = 0,
            CreatedAtUtc = now
        };

        _db.LoginOtpTokens.Add(otpToken);
        await _db.SaveChangesAsync();

        // Send OTP via existing SMTP (same style as forgot password)
        var subject = "Your login verification code";
        var body = $@"
            <p>Your verification code is:</p>
            <h2 style=""letter-spacing:2px"">{code}</h2>
            <p>This code expires in <b>5 minutes</b>.</p>
        ";

        await _email.SendAsync(user.Email, subject, body);

        // IMPORTANT: no JWT returned here
        return Ok(new Login2FaStartResponse
        {
            OtpRequired = true,
            LoginAttemptId = otpToken.Id
        });
    }

    // STEP 2: verify OTP -> issue JWT

    [HttpPost("verify-2fa")]
    public async Task<IActionResult> Verify2Fa([FromBody] Verify2FaRequest req)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var attempt = await _db.LoginOtpTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == req.LoginAttemptId);

        if (attempt == null)
            return Unauthorized(new { message = "Invalid or expired code." });

        var now = DateTime.UtcNow;

        if (attempt.IsUsed || attempt.IsInvalidated || attempt.ExpiresAtUtc <= now)
            return Unauthorized(new { message = "Invalid or expired code." });

        var code = req.Code.Trim();

        // verify
        var valid = OtpService.Verify(code, attempt.Salt, attempt.CodeHash);
        if (!valid)
            return Unauthorized(new { message = "Invalid or expired code." });

        // mark used
        attempt.IsUsed = true;
        attempt.UsedAtUtc = now;

        await _db.SaveChangesAsync();

        var token = _jwt.CreateToken(attempt.User);

        return Ok(new AuthResponse
        {
            AccessToken = token,
            User = new UserMeResponse
            {
                Id = attempt.User.Id,
                Name = attempt.User.Name,
                Username = attempt.User.Username,
                Email = attempt.User.Email,
                Role = attempt.User.Role.ToString()
            }
        });
    }

    // Resend OTP (rate-limited)

    [HttpPost("resend-2fa")]
    public async Task<IActionResult> Resend2Fa([FromBody] Resend2FaRequest req)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var attempt = await _db.LoginOtpTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == req.LoginAttemptId);

        if (attempt == null)
            return Unauthorized(new { message = "Unable to resend." });

        var now = DateTime.UtcNow;

        if (attempt.IsUsed || attempt.IsInvalidated || attempt.ExpiresAtUtc <= now)
            return Unauthorized(new { message = "Unable to resend." });

        // rate limit: 30s cooldown, max 5 resends
        if ((now - attempt.LastSentAtUtc).TotalSeconds < 30)
            return StatusCode(429, new { message = "Please wait before resending." });

        if (attempt.ResendCount >= 5)
            return StatusCode(429, new { message = "Resend limit reached." });

        var newCode = OtpService.GenerateCode();
        var newSalt = OtpService.GenerateSalt();
        var newHash = OtpService.Hash(newCode, newSalt);

        attempt.Salt = newSalt;
        attempt.CodeHash = newHash;
        attempt.ExpiresAtUtc = now.AddMinutes(5);
        attempt.LastSentAtUtc = now;
        attempt.ResendCount += 1;

        await _db.SaveChangesAsync();

        var subject = "Your login verification code";
        var body = $@"
            <p>Your verification code is:</p>
            <h2 style=""letter-spacing:2px"">{newCode}</h2>
            <p>This code expires in <b>5 minutes</b>.</p>
        ";

        await _email.SendAsync(attempt.User.Email, subject, body);

        return Ok(new { message = "Verification code sent." });
    }

    // Me

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = GetUserId();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return Unauthorized(new { message = "User not found." });

        return Ok(new UserMeResponse
        {
            Id = user.Id,
            Name = user.Name,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString()
        });
    }

    // Forgot Password

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var email = req.Email.Trim().ToLowerInvariant();

        var generic = new { message = "If that email exists, we sent a link to reset your password." };

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
            return Ok(generic);

        // Generating secure token
        var rawToken = CreateSecureToken();
        var tokenHash = Sha256Hex(rawToken);

        // Invalidating previous unused tokens
        var oldTokens = await _db.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.UsedAtUtc == null)
            .ToListAsync();

        foreach (var t in oldTokens)
            t.UsedAtUtc = DateTime.UtcNow;

        var resetToken = new PasswordResetToken
        {
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(15)
        };

        _db.PasswordResetTokens.Add(resetToken);
        await _db.SaveChangesAsync();

        var frontendBase = _cfg["Frontend:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5173";
        var link = $"{frontendBase}/reset-password?token={Uri.EscapeDataString(rawToken)}";

        var subject = "Reset your password";
        var body = $@"
            <p>You requested a password reset.</p>
            <p><a href=""{link}"">Click here to reset your password</a></p>
            <p>This link expires in 15 minutes.</p>
        ";

        await _email.SendAsync(user.Email, subject, body);

        return Ok(generic);
    }

    // Reset password

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (req.Password != req.ConfirmPassword)
            return BadRequest(new { message = "ConfirmPassword does not match Password." });

        var token = req.Token?.Trim();
        if (string.IsNullOrWhiteSpace(token))
            return BadRequest(new { message = "Invalid or expired token." });

        var tokenHash = Sha256Hex(token);

        var record = await _db.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

        if (record == null ||
            record.UsedAtUtc != null ||
            record.ExpiresAtUtc < DateTime.UtcNow)
        {
            return BadRequest(new { message = "Invalid or expired token." });
        }

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == record.UserId);
        if (user == null)
            return BadRequest(new { message = "Invalid or expired token." });

        PasswordHasher.CreatePasswordHash(req.Password, out var hash, out var salt);

        user.PasswordHash = hash;
        user.PasswordSalt = salt;

        record.UsedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Password reset successful." });
    }

    // helpers

    private int GetUserId()
    {
        var sub =
            User.FindFirstValue(JwtRegisteredClaimNames.Sub) ??
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue("id");

        if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var id))
            throw new UnauthorizedAccessException("Invalid token.");

        return id;
    }

    private static string CreateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        var b64 = Convert.ToBase64String(bytes);
        return b64.Replace("+", "-").Replace("/", "_").Replace("=", "");
    }

    private static string Sha256Hex(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}