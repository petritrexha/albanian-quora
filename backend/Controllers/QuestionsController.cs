using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlbanianQuora.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/questions
        [HttpGet]
        public async Task<IActionResult> GetQuestions([FromQuery] int? userId)
        {
            var questions = await _context.Questions
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            // If a userId is provided, determine which questions are bookmarked by that user
            Dictionary<int, int> bookmarkMap = new Dictionary<int, int>();
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
                q.Description,
                q.Votes,
                q.Views,
                q.Answers,
                q.CreatedAt,
                IsBookmarked = bookmarkMap.ContainsKey(q.Id),
                BookmarkId = bookmarkMap.ContainsKey(q.Id) ? (int?)bookmarkMap[q.Id] : null
            });

            return Ok(result);
        }

        // GET: api/questions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestion(int id, [FromQuery] int? userId)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
            {
                return NotFound();
            }

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
                question.Description,
                question.Votes,
                question.Views,
                question.Answers,
                question.CreatedAt,
                IsBookmarked = isBookmarked,
                BookmarkId = bookmarkId
            };

            return Ok(result);
        }

        // POST: api/questions
        [HttpPost]
        public async Task<ActionResult<Question>> CreateQuestion(Question question)
        {
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetQuestion),
                new { id = question.Id },
                question
            );
        }

        // PUT: api/questions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, Question updatedQuestion)
        {
            if (id != updatedQuestion.Id)
            {
                return BadRequest();
            }

            _context.Entry(updatedQuestion).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/questions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
            {
                return NotFound();
            }

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}