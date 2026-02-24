using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        {
            query = query.Where(t => t.CategoryId == categoryId.Value);
        }

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


    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    [HttpPost]
    public IActionResult Create(Tag tag)
    {
        _context.Tags.Add(tag);
        _context.SaveChanges();

        return Ok(tag);
    }
}
