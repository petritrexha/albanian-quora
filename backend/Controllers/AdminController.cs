using AlbanianQuora.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlbanianQuora.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats()
    {
        var users = await _db.Users.CountAsync();
        var questions = await _db.Questions.CountAsync();
        var answers = await _db.Answers.CountAsync();
        return Ok(new { users, questions, answers });
    }

    // --- USER MANAGEMENT ---
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var users = await _db.Users
            .OrderByDescending(u => u.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new { u.Id, u.Username, u.Email, Role = u.Role.ToString() })
            .ToListAsync();
        return Ok(users);
    }

    [HttpDelete("users/{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // --- CONTENT MANAGEMENT ---
    [HttpGet("questions")]
    public async Task<IActionResult> GetQuestions()
    {
        // Changed OrderBy to use Id to avoid CreatedAtUtc naming errors
        var questions = await _db.Questions
            .OrderByDescending(q => q.Id)
            .Select(q => new {
                q.Id,
                Content = q.Title,
                Username = q.User != null ? q.User.Username : "Anonim"
            })
            .ToListAsync();
        return Ok(questions);
    }

    [HttpDelete("questions/{id:int}")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
        var question = await _db.Questions.FindAsync(id);
        if (question == null) return NotFound();
        _db.Questions.Remove(question);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("answers")]
    public async Task<IActionResult> GetAnswers()
    {
        // Changed OrderBy to use Id to avoid CreatedAtUtc naming errors
        var answers = await _db.Answers
            .OrderByDescending(a => a.Id)
            .Select(a => new {
                a.Id,
                Content = a.Content,
                Username = a.User != null ? a.User.Username : "Anonim"
            })
            .ToListAsync();
        return Ok(answers);
    }

    [HttpDelete("answers/{id:int}")]
    public async Task<IActionResult> DeleteAnswer(int id)
    {
        var answer = await _db.Answers.FindAsync(id);
        if (answer == null) return NotFound();
        _db.Answers.Remove(answer);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

//using AlbanianQuora.Api.Data;
//using AlbanianQuora.DTOs;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;

//namespace AlbanianQuora.Api.Controllers;

//[ApiController]
//[Route("api/admin")]
//[Authorize(Roles = "Admin")]
//public class AdminController : ControllerBase
//{
//    private readonly AppDbContext _db;

//    public AdminController(AppDbContext db)
//    {
//        _db = db;
//    }

//    [HttpGet("stats")]
//        public async Task<IActionResult> Stats()
//    {
//        var users = await _db.Users.CountAsync();
//        var questions = await _db.Questions.CountAsync();
//        var answers = await _db.Answers.CountAsync();
//        return Ok(new { users, questions, answers });
//    }

//    [HttpGet("users")]
//    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
//    {
//        if (page <= 0 || pageSize <= 0) return BadRequest(new { error = "Invalid paging parameters." });

//        var total = await _db.Users.CountAsync();
//        var users = await _db.Users
//            .OrderBy(u => u.Id)
//            .Skip((page - 1) * pageSize)
//            .Take(pageSize)
//            .Select(u => new { u.Id, u.Name, u.Username, u.Email, Role = u.Role.ToString(), u.CreatedAtUtc })
//            .ToListAsync();

//        return Ok(new { total, page, pageSize, data = users });
//    }

//    [HttpDelete("users/{id:int}")]
//    public async Task<IActionResult> DeleteUser(int id)
//    {
//        var user = await _db.Users.FindAsync(id);
//        if (user == null) return NotFound();

//        _db.Users.Remove(user);
//        await _db.SaveChangesAsync();
//        return NoContent();
//    }
//}
