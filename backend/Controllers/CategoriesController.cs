using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult Create(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name
        };

        _context.Categories.Add(category);
        _context.SaveChanges();

        return Ok(category);
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var categories = _context.Categories
            .Where(c => c.IsActive)
            .ToList();

        return Ok(categories);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var category = _context.Categories.Find(id);

        if (category == null)
            return NotFound();

        _context.Categories.Remove(category);
        _context.SaveChanges();

        return NoContent();
    }

}
