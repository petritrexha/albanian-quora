using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlbanianQuora.Api.Controllers
{
    using System.Security.Claims;
    using Microsoft.AspNetCore.Authorization;

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookmarksController : ControllerBase
    {
        private readonly IBookmarkService _bookmarkService;

        public BookmarksController(IBookmarkService bookmarkService)
        {
            _bookmarkService = bookmarkService;
        }

        // POST api/bookmarks
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookmarkDto dto)
        {
            try
            {
                // enforce user from token
                var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
                if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                    return Unauthorized();

                dto.UserId = currentUserId;

                var result = await _bookmarkService.CreateBookmarkAsync(dto);
                return CreatedAtAction(nameof(GetByUser), new { userId = result.UserId }, result);
            }
            catch (InvalidOperationException ex)
            {
                // Return BadRequest when it's a validation-like message (e.g., question not found)
                if (ex.Message.Contains("not found") || ex.Message.Contains("not exist") || ex.Message.Contains("not found."))
                {
                    return BadRequest(new { error = ex.Message });
                }

                return Conflict(new { error = ex.Message });
            }
        }

        // GET api/bookmarks/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var bookmarks = await _bookmarkService.GetBookmarksByUserAsync(userId);
            return Ok(bookmarks);
        }

        // DELETE api/bookmarks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                return Unauthorized();

            // allow admin to delete any bookmark
            if (User.IsInRole("Admin"))
            {
                var deleted = await _bookmarkService.DeleteBookmarkAsync(id, null);
                if (!deleted) return NotFound();
                return NoContent();
            }

            var ok = await _bookmarkService.DeleteBookmarkAsync(id, currentUserId);
            if (!ok) return NotFound();
            return NoContent();
        }

        // DELETE api/bookmarks?userId=1&questionId=2
        [HttpDelete]
        public async Task<IActionResult> DeleteByUserQuestion([FromQuery] int userId, [FromQuery] int questionId)
        {
            if (userId <= 0 || questionId <= 0) return BadRequest(new { error = "userId and questionId are required." });

            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                return Unauthorized();

            if (currentUserId != userId && !User.IsInRole("Admin"))
                return Forbid();

            var deleted = await _bookmarkService.DeleteBookmarkByUserAndQuestionAsync(userId, questionId);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET api/bookmarks/check?userId=1&questionId=2
        [HttpGet("check")]
        public async Task<IActionResult> Check([FromQuery] int userId, [FromQuery] int questionId)
        {
            var isBookmarked = await _bookmarkService.IsBookmarkedAsync(userId, questionId);
            return Ok(new { isBookmarked });
        }
    }
}
