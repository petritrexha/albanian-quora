using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Models;
using AlbanianQuora.Api.Services;
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
        private readonly IAnswerService _answerService;

        public QuestionsController(AppDbContext context, IAnswerService answerService)
        {
            _context = context;
            _answerService = answerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuestions(
            [FromQuery] int? categoryId,
            [FromQuery] int? userId,
            [FromQuery] string? tag,
            [FromQuery] string? search)
        {
            var query = _context.Questions
                .Include(q => q.Category)
                .Include(q => q.AnswersList)
                .Include(q => q.QuestionTags)
                    .ThenInclude(qt => qt.Tag)
                .AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(q => q.CategoryId == categoryId.Value);

            if (!string.IsNullOrWhiteSpace(tag))
            {
                var tagLower = tag.Trim().ToLowerInvariant();
                query = query.Where(q => q.QuestionTags.Any(qt => qt.Tag.Name.ToLower() == tagLower));
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.Trim().ToLowerInvariant();
                query = query.Where(q =>
                    (q.Title != null && q.Title.ToLower().Contains(searchLower)) ||
                    (q.Description != null && q.Description.ToLower().Contains(searchLower)));
            }

            var questions = await query
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

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
                AnswerCount = q.AnswersList.Count,
                q.CreatedAt,
                Category = q.Category != null ? q.Category.Name : null,
                Tags = q.QuestionTags.Select(qt => qt.Tag.Name).ToList(),
                IsBookmarked = bookmarkMap.ContainsKey(q.Id),
                BookmarkId = bookmarkMap.ContainsKey(q.Id) ? (int?)bookmarkMap[q.Id] : null
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestion(int id, [FromQuery] int? userId)
        {
            var question = await _context.Questions
                .Include(q => q.Category)
                .Include(q => q.QuestionTags)
                    .ThenInclude(qt => qt.Tag)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null) return NotFound();

            var answers = await _answerService.GetByQuestionId(id);

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
                Answers = answers,
                question.CreatedAt,
                Category = question.Category != null ? question.Category.Name : null,
                Tags = question.QuestionTags.Select(qt => qt.Tag.Name).ToList(),
                IsBookmarked = isBookmarked,
                BookmarkId = bookmarkId
            };

            return Ok(result);
        }

        [HttpPost("{id}/upvote")]
        public async Task<IActionResult> Upvote(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound();
            question.Votes += 1;
            await _context.SaveChangesAsync();
            return Ok(question.Votes);
        }

        [HttpPost("{id}/downvote")]
        public async Task<IActionResult> Downvote(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound();
            question.Votes -= 1;
            await _context.SaveChangesAsync();
            return Ok(question.Votes);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateQuestionDto dto)
        {
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId && c.IsActive);
            if (!categoryExists) return BadRequest("Invalid category.");

            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists) return BadRequest("Invalid user.");

            var question = new Question
            {
                Title = dto.Title,
                Description = dto.Content,
                CategoryId = dto.CategoryId,
                UserId = dto.UserId
            };
 
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            foreach (var tagId in dto.TagIds)
            {
                var tagExists = await _context.Tags.AnyAsync(t => t.Id == tagId);
                if (!tagExists) continue;
                _context.QuestionTags.Add(new QuestionTag { QuestionId = question.Id, TagId = tagId });
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateQuestionDto dto)
        {
            var question = await _context.Questions.Include(q => q.QuestionTags).FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) return NotFound();

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var question = await _context.Questions.Include(q => q.QuestionTags).FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) return NotFound();
            _context.QuestionTags.RemoveRange(question.QuestionTags);
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}



//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using AlbanianQuora.Api.Data;
//using AlbanianQuora.Api.DTOs;
//using AlbanianQuora.Api.Models;
//using AlbanianQuora.Api.Services; // Added this
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace AlbanianQuora.Api.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class QuestionsController : ControllerBase
//    {
//        private readonly AppDbContext _context;
//        private readonly IAnswerService _answerService; // Added service

//        public QuestionsController(AppDbContext context, IAnswerService answerService)
//        {
//            _context = context;
//            _answerService = answerService;
//        }

//        // GET: api/questions?categoryId=1&userId=1
//        [HttpGet]
//        public async Task<IActionResult> GetQuestions([FromQuery] int? categoryId, [FromQuery] int? userId)
//        {
//            var query = _context.Questions
//                .Include(q => q.Category)
//                .Include(q => q.Answers) // Include answers for the count
//                .Include(q => q.QuestionTags)
//                    .ThenInclude(qt => qt.Tag)
//                .AsQueryable();

//            if (categoryId.HasValue)
//            {
//                query = query.Where(q => q.CategoryId == categoryId.Value);
//            }

//            var questions = await query
//                .OrderByDescending(q => q.CreatedAt)
//                .ToListAsync();

//            Dictionary<int, int> bookmarkMap = new();
//            if (userId.HasValue)
//            {
//                bookmarkMap = await _context.Bookmarks
//                    .Where(b => b.UserId == userId.Value)
//                    .ToDictionaryAsync(b => b.QuestionId, b => b.Id);
//            }

//            var result = questions.Select(q => new
//            {
//                q.Id,
//                q.Title,
//                Content = q.Description,
//                q.Votes,
//                q.Views,
//                AnswerCount = q.Answers.Count, // Shows number of answers in list
//                q.CreatedAt,
//                Category = q.Category != null ? q.Category.Name : null,
//                Tags = q.QuestionTags.Select(qt => qt.Tag.Name).ToList(),
//                IsBookmarked = bookmarkMap.ContainsKey(q.Id),
//                BookmarkId = bookmarkMap.ContainsKey(q.Id) ? (int?)bookmarkMap[q.Id] : null
//            });

//            return Ok(result);
//        }

//        // GET: api/questions/5?userId=1
//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetQuestion(int id, [FromQuery] int? userId)
//        {
//            var question = await _context.Questions
//                .Include(q => q.Category)
//                .Include(q => q.QuestionTags)
//                    .ThenInclude(qt => qt.Tag)
//                .FirstOrDefaultAsync(q => q.Id == id);

//            if (question == null)
//            {
//                return NotFound();
//            }

//            // Fetch answers from your existing service
//            var answers = await _answerService.GetByQuestionId(id);

//            // increment views
//            question.Views += 1;
//            await _context.SaveChangesAsync();

//            int? bookmarkId = null;
//            bool isBookmarked = false;
//            if (userId.HasValue)
//            {
//                var bk = await _context.Bookmarks.FirstOrDefaultAsync(b => b.UserId == userId.Value && b.QuestionId == id);
//                if (bk != null)
//                {
//                    isBookmarked = true;
//                    bookmarkId = bk.Id;
//                }
//            }

//            var result = new
//            {
//                question.Id,
//                question.Title,
//                Content = question.Description,
//                question.Votes,
//                question.Views,
//                Answers = answers, // Tied together here!
//                question.CreatedAt,
//                Category = question.Category != null ? question.Category.Name : null,
//                Tags = question.QuestionTags.Select(qt => qt.Tag.Name).ToList(),
//                IsBookmarked = isBookmarked,
//                BookmarkId = bookmarkId
//            };

//            return Ok(result);
//        }

//        [HttpPost]
//        public async Task<IActionResult> Create([FromBody] CreateQuestionDto dto)
//        {
//            var categoryExists = await _context.Categories
//                .AnyAsync(c => c.Id == dto.CategoryId && c.IsActive);

//            if (!categoryExists)
//                return BadRequest("Invalid category.");

//            var userExists = await _context.Users
//                .AnyAsync(u => u.Id == dto.UserId);

//            if (!userExists)
//                return BadRequest("Invalid user.");

//            var question = new Question
//            {
//                Title = dto.Title,
//                Description = dto.Content,
//                CategoryId = dto.CategoryId,
//                UserId = dto.UserId
//            };

//            _context.Questions.Add(question);
//            await _context.SaveChangesAsync();

//            foreach (var tagId in dto.TagIds)
//            {
//                var tagExists = await _context.Tags.AnyAsync(t => t.Id == tagId);
//                if (!tagExists)
//                    continue;

//                _context.QuestionTags.Add(new QuestionTag
//                {
//                    QuestionId = question.Id,
//                    TagId = tagId
//                });
//            }

//            await _context.SaveChangesAsync();

//            return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question);
//        }

//        [HttpPut("{id}")]
//        public async Task<IActionResult> Update(int id, [FromBody] CreateQuestionDto dto)
//        {
//            var question = await _context.Questions.Include(q => q.QuestionTags).FirstOrDefaultAsync(q => q.Id == id);
//            if (question == null)
//                return NotFound();

//            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId && c.IsActive);
//            if (!categoryExists)
//                return BadRequest("Invalid category.");

//            question.Title = dto.Title;
//            question.Description = dto.Content;
//            question.CategoryId = dto.CategoryId;

//            _context.QuestionTags.RemoveRange(question.QuestionTags);

//            foreach (var tagId in dto.TagIds)
//            {
//                var tagExists = await _context.Tags.AnyAsync(t => t.Id == tagId);
//                if (!tagExists) continue;

//                _context.QuestionTags.Add(new QuestionTag { QuestionId = question.Id, TagId = tagId });
//            }

//            await _context.SaveChangesAsync();

//            return Ok(question);
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            var question = await _context.Questions.Include(q => q.QuestionTags).FirstOrDefaultAsync(q => q.Id == id);
//            if (question == null)
//                return NotFound();

//            _context.QuestionTags.RemoveRange(question.QuestionTags);
//            _context.Questions.Remove(question);

//            await _context.SaveChangesAsync();

//            return NoContent();
//        }
//    }
//}


