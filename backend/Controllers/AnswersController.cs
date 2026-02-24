using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Services;
using AlbanianQuora.Api.Data; // Added for context access
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AlbanianQuora.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswersController : ControllerBase
    {
        private readonly IAnswerService _service;
        private readonly AppDbContext _context; // Added to access the database directly for simple increments

        public AnswersController(IAnswerService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpGet("question/{questionId}")]
        public async Task<IActionResult> GetByQuestion(int questionId)
        {
            var answers = await _service.GetByQuestionId(questionId);
            return Ok(answers);
        }

        [HttpPost("{id}/upvote")]
        public async Task<IActionResult> Upvote(int id)
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null) return NotFound();
            answer.Votes += 1;
            await _context.SaveChangesAsync();
            return Ok(answer.Votes);
        }

        [HttpPost("{id}/downvote")]
        public async Task<IActionResult> Downvote(int id)
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null) return NotFound();
            answer.Votes -= 1;
            await _context.SaveChangesAsync();
            return Ok(answer.Votes);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAnswerDto dto)
        {
            var userIdClaim = User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();
            if (!int.TryParse(userIdClaim, out int userId)) return BadRequest("Invalid user ID.");

            await _service.CreateAnswer(userId, dto);
            return Ok();
        }
    }
}

//using AlbanianQuora.Api.DTOs;
//using AlbanianQuora.Api.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using System.Security.Claims;
//using System.Threading.Tasks;

//namespace AlbanianQuora.Api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AnswersController : ControllerBase
//    {
//        private readonly IAnswerService _service;

//        public AnswersController(IAnswerService service)
//        {
//            _service = service;
//        }

//        [HttpGet("question/{questionId}")]
//        public async Task<IActionResult> GetByQuestion(int questionId)
//        {
//            var answers = await _service.GetByQuestionId(questionId);
//            return Ok(answers);
//        }

//        [Authorize]
//        [HttpPost]
//        public async Task<IActionResult> Create([FromBody] CreateAnswerDto dto)
//        {
//            // Note: If you cleared the claim map in Program.cs, use "sub"
//            // If not, keep using ClaimTypes.NameIdentifier
//            var userIdClaim = User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

//            if (string.IsNullOrEmpty(userIdClaim))
//                return Unauthorized();

//            if (!int.TryParse(userIdClaim, out int userId))
//                return BadRequest("Invalid user ID.");

//            await _service.CreateAnswer(userId, dto);
//            return Ok();
//        }
//    }
//}


