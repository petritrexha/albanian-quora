using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Models;
using AlbanianQuora.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AlbanianQuora.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAnswerService _answerService;

        public QuestionsController(AppDbContext context, IAnswerService answerService)
        {
            _context = context;
            _answerService = answerService;
        }

        // GET: api/questions?categoryId=1&userId=1
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetQuestions([FromQuery] int? categoryId, [FromQuery] int? userId)
        {
            var query = _context.Questions
                .Include(q => q.Category)
                .Include(q => q.Answers)
                .Include(q => q.QuestionTags)
                    .ThenInclude(qt => qt.Tag)
                .AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(q => q.CategoryId == categoryId.Value);

            var questions = await query
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            // bookmark map for provided userId (optional)
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
                AnswerCount = q.Answers.Count,
                q.CreatedAt,

                CategoryId = q.CategoryId,
                Category = q.Category != null ? q.Category.Name : null,

                Tags = q.QuestionTags.Select(qt => qt.Tag.Name).ToList(),
                TagIds = q.QuestionTags.Select(qt => qt.TagId).ToList(),

                IsBookmarked = bookmarkMap.ContainsKey(q.Id),
                BookmarkId = bookmarkMap.ContainsKey(q.Id) ? (int?)bookmarkMap[q.Id] : null
            }).ToList();

            return Ok(result);
        }

        // GET: api/questions/5?userId=1
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestion(int id, [FromQuery] int? userId)
        {
            var question = await _context.Questions
                .Include(q => q.Category)
                .Include(q => q.QuestionTags)
                    .ThenInclude(qt => qt.Tag)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
                return NotFound();

            // fetch answers from service
            var answers = await _answerService.GetByQuestionId(id);

            // increment views
            question.Views += 1;
            await _context.SaveChangesAsync();

            int? bookmarkId = null;
            bool isBookmarked = false;

            if (userId.HasValue)
            {
                var bk = await _context.Bookmarks
                    .FirstOrDefaultAsync(b => b.UserId == userId.Value && b.QuestionId == id);

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
                Answers = answers,
                question.CreatedAt,

                CategoryId = question.CategoryId,
                Category = question.Category != null ? question.Category.Name : null,

                Tags = question.QuestionTags.Select(qt => qt.Tag.Name).ToList(),
                TagIds = question.QuestionTags.Select(qt => qt.TagId).ToList(),

                IsBookmarked = isBookmarked,
                BookmarkId = bookmarkId
            };

            return Ok(result);
        }

        // POST: api/questions (auth required)
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateQuestionDto dto)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == dto.CategoryId && c.IsActive);

            if (category == null)
                return BadRequest("Invalid category.");

            var currentUserId = GetUserIdFromJwt();

            var question = new Question
            {
                Title = dto.Title,
                Description = dto.Content,
                CategoryId = dto.CategoryId,
                UserId = currentUserId
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

        // PUT: api/questions/5 (owner or admin)
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateQuestionDto dto)
        {
            var question = await _context.Questions
                .Include(q => q.QuestionTags)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
                return NotFound();

            var currentUserId = GetUserIdFromJwt();

            if (question.UserId != currentUserId && !User.IsInRole("Admin"))
                return Forbid();

            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.CategoryId && c.IsActive);

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

                _context.QuestionTags.Add(new QuestionTag
                {
                    QuestionId = question.Id,
                    TagId = tagId
                });
            }

            await _context.SaveChangesAsync();

            return Ok(question);
        }

        // DELETE: api/questions/5 (owner or admin)
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var question = await _context.Questions
                .Include(q => q.QuestionTags)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
                return NotFound();

            var currentUserId = GetUserIdFromJwt();

            if (question.UserId != currentUserId && !User.IsInRole("Admin"))
                return Forbid();

            _context.QuestionTags.RemoveRange(question.QuestionTags);
            _context.Questions.Remove(question);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Votes (auth)
        [Authorize]
        [HttpPost("{id}/upvote")]
        public async Task<IActionResult> Upvote(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound();

            question.Votes += 1;
            await _context.SaveChangesAsync();

            return Ok(question.Votes);
        }

        [Authorize]
        [HttpPost("{id}/downvote")]
        public async Task<IActionResult> Downvote(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound();

            question.Votes -= 1;
            await _context.SaveChangesAsync();

            return Ok(question.Votes);
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
    }
}