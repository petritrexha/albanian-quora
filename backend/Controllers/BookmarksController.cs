using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlbanianQuora.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
                var result = await _bookmarkService.CreateBookmarkAsync(dto);
                return CreatedAtAction(nameof(GetByUser), new { userId = result.UserId }, result);
            }
            catch (InvalidOperationException ex)
            {
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
            var deleted = await _bookmarkService.DeleteBookmarkAsync(id);
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
