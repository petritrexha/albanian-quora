using AlbanianQuora.DTOs;
using AlbanianQuora.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace AlbanianQuora.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _users;

        public UsersController(IUserService users)
        {
            _users = users;
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var profile = await _users.GetProfileAsync(id);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        [HttpGet]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            if (page <= 0 || pageSize <= 0) return BadRequest(new { error = "Invalid paging parameters." });

            // simple pagination via Users table
            var total = await _usersCount();
            var users = await Task.Run(() =>
            {
                // use DB directly for listing to avoid adding to IUserService
                using var scope = HttpContext.RequestServices.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AlbanianQuora.Api.Data.AppDbContext>();
                return db.Users.OrderBy(u => u.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(u => new { u.Id, u.Name, u.Username, u.Email, Role = u.Role.ToString(), u.CreatedAtUtc })
                    .ToList();
            });

            return Ok(new { total, page, pageSize, data = users });
        }

        private async Task<int> _usersCount()
        {
            using var scope = HttpContext.RequestServices.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AlbanianQuora.Api.Data.AppDbContext>();
            return await db.Users.CountAsync();
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
        {
            // Only owner or admin can update
            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                return Unauthorized();

            if (currentUserId != id && !User.IsInRole("Admin"))
                return Forbid();

            var ok = await _users.UpdateProfileAsync(id, dto);
            if (!ok) return NotFound();

            return NoContent();
        }

    }
}