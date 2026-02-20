using AlbanianQuora.DTOs;
using AlbanianQuora.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlbanianQuora.Api.Controllers
{
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
        public async Task<IActionResult> Update(int id, [FromQuery] int userId, [FromBody] UpdateUserDto dto)
        {
            if (userId != id) return Forbid();

            var ok = await _users.UpdateProfileAsync(id, dto);
            if (!ok) return NotFound();

            return NoContent();
        }
    }
}