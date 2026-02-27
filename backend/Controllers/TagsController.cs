using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlbanianQuora.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TagsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] int? categoryId)
    {
        var query = _context.Tags.AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(t => t.CategoryId == categoryId.Value);

        var tags = query
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.CategoryId
            })
            .ToList();

        return Ok(tags);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public IActionResult Create([FromBody] CreateTagDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Name is required.");

        var tag = new Tag
        {
            Name = dto.Name.Trim(),
            CategoryId = dto.CategoryId
        };
        _context.Tags.Add(tag);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetAll), new { id = tag.Id }, new
        {
            id = tag.Id,
            name = tag.Name,
            categoryId = tag.CategoryId
        });
    }
}