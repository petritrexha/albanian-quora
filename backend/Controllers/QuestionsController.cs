using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlbanianQuora.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuestionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/questions?categoryId=1
    [HttpGet]
    public IActionResult GetAll([FromQuery] int? categoryId)
    {
        var query = _context.Questions
            .Include(q => q.Category)
            .Include(q => q.QuestionTags)
                .ThenInclude(qt => qt.Tag)
            .Where(q => q.Category != null && q.Category.IsActive)
            .AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(q => q.CategoryId == categoryId.Value);
        }

        var questions = query
            .Select(q => new
            {
                q.Id,
                q.Title,
                q.Content,
                q.CreatedAt,
                Category = q.Category!.Name,
                Tags = q.QuestionTags
                    .Select(qt => qt.Tag.Name)
                    .ToList()
            })
            .ToList();

        return Ok(questions);
    }

    // POST /api/questions
    [HttpPost]
    public IActionResult Create(CreateQuestionDto dto)
    {
        var category = _context.Categories
            .FirstOrDefault(c => c.Id == dto.CategoryId && c.IsActive);

        if (category == null)
            return BadRequest("Invalid category.");

        var question = new Question
        {
            Title = dto.Title,
            Content = dto.Content,
            CategoryId = dto.CategoryId
        };

        _context.Questions.Add(question);
        _context.SaveChanges();

        foreach (var tagId in dto.TagIds)
        {
            var tagExists = _context.Tags.Any(t => t.Id == tagId);
            if (!tagExists)
                continue;

            var questionTag = new QuestionTag
            {
                QuestionId = question.Id,
                TagId = tagId
            };

            _context.QuestionTags.Add(questionTag);
        }

        _context.SaveChanges();

        return CreatedAtAction(nameof(GetById), new { id = question.Id }, question);
    }

    // GET /api/questions/5
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var question = _context.Questions
            .Include(q => q.Category)
            .Include(q => q.QuestionTags)
                .ThenInclude(qt => qt.Tag)
            .Where(q => q.Id == id)
            .Select(q => new
            {
                q.Id,
                q.Title,
                q.Content,
                q.CreatedAt,
                Category = q.Category!.Name,
                Tags = q.QuestionTags
                    .Select(qt => qt.Tag.Name)
                    .ToList()
            })
            .FirstOrDefault();

        if (question == null)
            return NotFound();

        return Ok(question);
    }

    // PUT /api/questions/5
    [HttpPut("{id}")]
    public IActionResult Update(int id, CreateQuestionDto dto)
    {
        var question = _context.Questions
            .Include(q => q.QuestionTags)
            .FirstOrDefault(q => q.Id == id);

        if (question == null)
            return NotFound();

        var categoryExists = _context.Categories
            .Any(c => c.Id == dto.CategoryId && c.IsActive);

        if (!categoryExists)
            return BadRequest("Invalid category.");

        // update basic fields
        question.Title = dto.Title;
        question.Content = dto.Content;
        question.CategoryId = dto.CategoryId;

        // fshij lidhjet e vjetra me tags
        _context.QuestionTags.RemoveRange(question.QuestionTags);

        // shto tags e reja
        foreach (var tagId in dto.TagIds)
        {
            var tagExists = _context.Tags.Any(t => t.Id == tagId);
            if (!tagExists)
                continue;

            _context.QuestionTags.Add(new QuestionTag
            {
                QuestionId = question.Id,
                TagId = tagId
            });
        }

        _context.SaveChanges();

        return Ok(question);
    }
    // DELETE /api/questions/5
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var question = _context.Questions
            .Include(q => q.QuestionTags)
            .FirstOrDefault(q => q.Id == id);

        if (question == null)
            return NotFound();

        // fshij lidhjet me tags
        _context.QuestionTags.RemoveRange(question.QuestionTags);

        // fshij pyetjen
        _context.Questions.Remove(question);

        _context.SaveChanges();

        return NoContent();
    }


}
