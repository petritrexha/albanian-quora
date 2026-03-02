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
    private readonly IEmailSender _email; // Kept for Forgot Password
    private readonly IConfiguration _cfg;

    public AuthController(AppDbContext db, IJwtTokenService jwt, IEmailSender email, IConfiguration cfg)
    {
        _db = db;
        _jwt = jwt;
        _email = email;
        _cfg = cfg;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        if (req.Password != req.ConfirmPassword) return BadRequest(new { message = "Passwords do not match." });

        var email = req.Email.Trim().ToLowerInvariant();
        var username = req.Username.Trim();

        if (await _db.Users.AnyAsync(u => u.Email == email || u.Username == username))
            return Conflict(new { message = "Email or Username already in use." });

        PasswordHasher.CreatePasswordHash(req.Password, out var hash, out var salt);

        var user = new User {
            Name = req.Name.Trim(),
            Username = username,
            Email = email,
            PasswordHash = hash,
            PasswordSalt = salt
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new AuthResponse {
            AccessToken = _jwt.CreateToken(user),
            User = MapUserResponse(user)
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var inputLower = req.EmailOrUsername.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == inputLower || u.Username.ToLower() == inputLower);

        if (user == null || !PasswordHasher.VerifyPasswordHash(req.Password, user.PasswordHash, user.PasswordSalt))
            return Unauthorized(new { message = "Invalid credentials." });

        // --- 2FA BYPASS: Returning JWT immediately ---
        return Ok(new AuthResponse {
            AccessToken = _jwt.CreateToken(user),
            User = MapUserResponse(user)
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = GetUserId();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return Unauthorized(new { message = "User not found." });

        return Ok(MapUserResponse(user));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
    {
        // This stays exactly the same as your original code 
        // because you still want users to be able to reset passwords!
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var email = req.Email.Trim().ToLowerInvariant();
        var generic = new { message = "If that email exists, we sent a link to reset your password." };
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null) return Ok(generic);

        var rawToken = CreateSecureToken();
        var tokenHash = Sha256Hex(rawToken);
        var oldTokens = await _db.PasswordResetTokens.Where(t => t.UserId == user.Id && t.UsedAtUtc == null).ToListAsync();
        foreach (var t in oldTokens) t.UsedAtUtc = DateTime.UtcNow;

        _db.PasswordResetTokens.Add(new PasswordResetToken {
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(15)
        });
        await _db.SaveChangesAsync();

        var frontendBase = _cfg["Frontend:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5173";
        var link = $"{frontendBase}/reset-password?token={Uri.EscapeDataString(rawToken)}";
        await _email.SendAsync(user.Email, "Reset your password", $"<p><a href='{link}'>Click here to reset your password</a></p>");

        return Ok(generic);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
    {
        // This stays exactly the same as your original code
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        if (req.Password != req.ConfirmPassword) return BadRequest(new { message = "Passwords do not match." });

        var tokenHash = Sha256Hex(req.Token?.Trim() ?? "");
        var record = await _db.PasswordResetTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

        if (record == null || record.UsedAtUtc != null || record.ExpiresAtUtc < DateTime.UtcNow)
            return BadRequest(new { message = "Invalid or expired token." });

        var user = await _db.Users.FindAsync(record.UserId);
        if (user == null) return BadRequest();

        PasswordHasher.CreatePasswordHash(req.Password, out var hash, out var salt);
        user.PasswordHash = hash;
        user.PasswordSalt = salt;
        record.UsedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Password reset successful." });
    }

    // --- Helpers ---
    private UserMeResponse MapUserResponse(User user) => new UserMeResponse {
        Id = user.Id, Name = user.Name, Username = user.Username, Email = user.Email, Role = user.Role.ToString()
    };

    private int GetUserId() {
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var id)) throw new UnauthorizedAccessException();
        return id;
    }

    private static string CreateSecureToken() => Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)).Replace("+", "-").Replace("/", "_").Replace("=", "");
    private static string Sha256Hex(string input) {
        using var sha = SHA256.Create();
        return Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(input))).ToLowerInvariant();
    }
}