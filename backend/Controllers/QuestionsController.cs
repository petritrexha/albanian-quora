using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AlbanianQuora.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/questions?categoryId=1&userId=1
        [HttpGet]
        public async Task<IActionResult> GetQuestions([FromQuery] int? categoryId, [FromQuery] int? userId)
        {
            var query = _context.Questions
                .Include(q => q.Category)
                .Include(q => q.QuestionTags)
                    .ThenInclude(qt => qt.Tag)
                .AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(q => q.CategoryId == categoryId.Value);
            }

            var questions = await query
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            // build bookmark map for provided userId
            Dictionary<int, int> bookmarkMap = new();
            if (userId.HasValue)
            {
                bookmarkMap = await _context.Bookmarks
                    .Where(b => b.UserId == userId.Value)
                    .ToDictionaryAsync(b => b.QuestionId, b => b.Id);
            }

            var result = questions.Select(q => new
            {
                q.Id,
                q.Title,
                Content = q.Description,
                q.Votes,
                q.Views,
                q.Answers,
                q.CreatedAt,
                Category = q.Category != null ? q.Category.Name : null,
                Tags = q.QuestionTags.Select(qt => qt.Tag.Name).ToList(),
                IsBookmarked = bookmarkMap.ContainsKey(q.Id),
                BookmarkId = bookmarkMap.ContainsKey(q.Id) ? (int?)bookmarkMap[q.Id] : null
            });

            return Ok(result);
        }

        // GET: api/questions/5?userId=1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestion(int id, [FromQuery] int? userId)
        {
            var question = await _context.Questions
                .Include(q => q.Category)
                .Include(q => q.QuestionTags)
                    .ThenInclude(qt => qt.Tag)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
            {
                return NotFound();
            }

            // increment views
            question.Views += 1;
            await _context.SaveChangesAsync();

            int? bookmarkId = null;
            bool isBookmarked = false;
            if (userId.HasValue)
            {
                var bk = await _context.Bookmarks.FirstOrDefaultAsync(b => b.UserId == userId.Value && b.QuestionId == id);
                if (bk != null)
                {
                    isBookmarked = true;
                    bookmarkId = bk.Id;
                }
            }

            var result = new
            {
                question.Id,
                question.Title,
                Content = question.Description,
                question.Votes,
                question.Views,
                question.Answers,
                question.CreatedAt,
                Category = question.Category != null ? question.Category.Name : null,
                Tags = question.QuestionTags.Select(qt => qt.Tag.Name).ToList(),
                IsBookmarked = isBookmarked,
                BookmarkId = bookmarkId
            };

            return Ok(result);
        }

        // POST: api/questions
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateQuestionDto dto)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == dto.CategoryId && c.IsActive);
            if (category == null)
                return BadRequest("Invalid category.");

<<<<<<< HEAD
            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                return Unauthorized();
=======
<<<<<<< HEAD
            var userId = GetUserIdFromJwt();
=======
            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                return Unauthorized();
>>>>>>> c0ff189 (Admin user role and admin dashboard added)
>>>>>>> 35a8ddf (Admin user role and admin dashboard added)

            var question = new Question
            {
                Title = dto.Title,
                Description = dto.Content,
                CategoryId = dto.CategoryId,
<<<<<<< HEAD
                UserId = currentUserId
=======
<<<<<<< HEAD
                UserId = userId
=======
                UserId = currentUserId
>>>>>>> c0ff189 (Admin user role and admin dashboard added)
>>>>>>> 35a8ddf (Admin user role and admin dashboard added)
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            foreach (var tagId in dto.TagIds)
            {
                var tagExists = await _context.Tags.AnyAsync(t => t.Id == tagId);
                if (!tagExists) continue;

                _context.QuestionTags.Add(new QuestionTag
                {
                    QuestionId = question.Id,
                    TagId = tagId
                });
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question);
        }

        private int GetUserIdFromJwt()
        {
            var idStr =
                User.FindFirstValue(JwtRegisteredClaimNames.Sub) ??
                User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                User.FindFirstValue("id");

            if (string.IsNullOrWhiteSpace(idStr) || !int.TryParse(idStr, out var id))
                throw new UnauthorizedAccessException("Invalid token: missing user id.");

            return id;
        }

        // PUT: api/questions/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateQuestionDto dto)
        {
            var question = await _context.Questions.Include(q => q.QuestionTags).FirstOrDefaultAsync(q => q.Id == id);
            if (question == null)
                return NotFound();

<<<<<<< HEAD
=======
<<<<<<< HEAD
            //only the author can delete their question
            var userId = GetUserIdFromJwt();
            if (question.UserId != userId)
=======
>>>>>>> 35a8ddf (Admin user role and admin dashboard added)
            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                return Unauthorized();

            if (question.UserId != currentUserId && !User.IsInRole("Admin"))
<<<<<<< HEAD
=======
>>>>>>> c0ff189 (Admin user role and admin dashboard added)
>>>>>>> 35a8ddf (Admin user role and admin dashboard added)
                return Forbid();

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId && c.IsActive);
            if (!categoryExists)
                return BadRequest("Invalid category.");

            question.Title = dto.Title;
            question.Description = dto.Content;
            question.CategoryId = dto.CategoryId;

            _context.QuestionTags.RemoveRange(question.QuestionTags);

            foreach (var tagId in dto.TagIds)
            {
                var tagExists = await _context.Tags.AnyAsync(t => t.Id == tagId);
                if (!tagExists) continue;

                _context.QuestionTags.Add(new QuestionTag { QuestionId = question.Id, TagId = tagId });
            }

            await _context.SaveChangesAsync();

            return Ok(question);
        }

        // DELETE: api/questions/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var question = await _context.Questions.Include(q => q.QuestionTags).FirstOrDefaultAsync(q => q.Id == id);
            if (question == null)
                return NotFound();

<<<<<<< HEAD
=======
<<<<<<< HEAD
            //only the author can delete their question
            var userId = GetUserIdFromJwt();
            if (question.UserId != userId)
=======
>>>>>>> 35a8ddf (Admin user role and admin dashboard added)
            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                return Unauthorized();

            if (question.UserId != currentUserId && !User.IsInRole("Admin"))
<<<<<<< HEAD
=======
>>>>>>> c0ff189 (Admin user role and admin dashboard added)
>>>>>>> 35a8ddf (Admin user role and admin dashboard added)
                return Forbid();

            _context.QuestionTags.RemoveRange(question.QuestionTags);
            _context.Questions.Remove(question);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
