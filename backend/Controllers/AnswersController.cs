using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlbanianQuora.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnswersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AnswersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("question/{questionId}")]
        public async Task<IActionResult> Create(int questionId, [FromBody] CreateAnswerDto dto)
        {
            var question = await _db.Questions.FindAsync(questionId);
            if (question == null) return NotFound(new { error = "Question not found." });

            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                return Unauthorized();

            var answer = new Answer
            {
                Content = dto.Content,
                QuestionId = questionId,
                UserId = currentUserId
            };

            _db.Answers.Add(answer);
            question.Answers += 1;
            await _db.SaveChangesAsync();

            return CreatedAtAction(null, new { id = answer.Id }, answer);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var answer = await _db.Answers.FindAsync(id);
            if (answer == null) return NotFound();

            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var currentUserId))
                return Unauthorized();

            if (answer.UserId != currentUserId && !User.IsInRole("Admin"))
                return Forbid();

            // decrement question's answer count if present
            var question = await _db.Questions.FindAsync(answer.QuestionId);
            if (question != null && question.Answers > 0) question.Answers -= 1;

            _db.Answers.Remove(answer);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
