using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Models;
using AlbanianQuora.Api.Interfaces;
using AlbanianQuora.Api.Security;
using AlbanianQuora.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AlbanianQuora.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenService _jwt;

    public AuthController(AppDbContext db, IJwtTokenService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

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
            Token = token,
            User = new UserMeResponse
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username,
                Email = user.Email
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var input = req.EmailOrUsername.Trim();
        var inputLower = input.ToLowerInvariant();

        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.Email == inputLower || u.Username == input);

        if (user == null)
            return Unauthorized(new { message = "Invalid credentials." });

        var ok = PasswordHasher.VerifyPasswordHash(req.Password, user.PasswordHash, user.PasswordSalt);
        if (!ok)
            return Unauthorized(new { message = "Invalid credentials." });

        var token = _jwt.CreateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            User = new UserMeResponse
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username,
                Email = user.Email
            }
        });
    }

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
            Email = user.Email
        });
    }

    private int GetUserId()
    {
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var id))
            throw new UnauthorizedAccessException("Invalid token.");
        return id;
    }
}