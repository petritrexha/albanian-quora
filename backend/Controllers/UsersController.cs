using AlbanianQuora.DTOs;
using AlbanianQuora.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

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

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
        {
            var ok = await _users.UpdateProfileAsync(id, dto);
            if (!ok) return NotFound();

            return NoContent();
        }

    }
}