using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Models;
using AlbanianQuora.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AlbanianQuora.Api.Controllers
{
    [ApiController]
    [Route("api")]
    public class AnswersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AnswersController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/questions/{questionId}/answers
        [HttpGet("questions/{questionId:int}/answers")]
        public async Task<IActionResult> GetForQuestion(int questionId)
        {
            var answers = await _db.Answers
                .Where(a => a.QuestionId == questionId)
                .OrderByDescending(a => a.CreatedAtUtc)
                .Select(a => new
                {
                    a.Id,
                    a.Content,
                    a.CreatedAtUtc,
                    a.UserId,
                    Username = a.User.Username
                })
                .ToListAsync();

            return Ok(answers);
        }

        // POST /api/questions/{questionId}/answers
        [Authorize]
        [HttpPost("questions/{questionId:int}/answers")]
        public async Task<IActionResult> Create(int questionId, [FromBody] CreateAnswerDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(new { message = "Content is required." });

            var questionExists = await _db.Questions.AnyAsync(q => q.Id == questionId);
            if (!questionExists)
                return NotFound(new { message = "Question not found." });

            var userId = GetUserIdFromJwt();

            var answer = new Answer
            {
                Content = dto.Content.Trim(),
                QuestionId = questionId,
                UserId = userId
            };

            _db.Answers.Add(answer);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetForQuestion), new { questionId }, new { answer.Id });
        }

        // PUT /api/answers/{id}
        [Authorize]
        [HttpPut("answers/{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateAnswerDto dto)
        {
            var answer = await _db.Answers.FirstOrDefaultAsync(a => a.Id == id);
            if (answer == null) return NotFound();

            var userId = GetUserIdFromJwt();
            if (answer.UserId != userId) return Forbid();

            if (dto == null || string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(new { message = "Content is required." });

            answer.Content = dto.Content.Trim();
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /api/answers/{id}
        [Authorize]
        [HttpDelete("answers/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var answer = await _db.Answers.FirstOrDefaultAsync(a => a.Id == id);
            if (answer == null) return NotFound();

            var userId = GetUserIdFromJwt();
            if (answer.UserId != userId) return Forbid();

            _db.Answers.Remove(answer);
            await _db.SaveChangesAsync();

            return NoContent();
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