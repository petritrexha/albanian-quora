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

    // ======================
    // CREATE CATEGORY
    // ======================
    [HttpPost]
    public IActionResult Create(CreateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Category name is required.");

        var exists = _context.Categories
            .Any(c => c.Name == dto.Name && c.IsActive);

        if (exists)
            return BadRequest("Category already exists.");

        var category = new Category
        {
            Name = dto.Name,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        _context.SaveChanges();

        return Ok(category);
    }

    // ======================
    // GET ALL ACTIVE
    // ======================
    [HttpGet]
    public IActionResult GetAll()
    {
        var categories = _context.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .ToList();

        return Ok(categories);
    }

    // ======================
    // SOFT DELETE
    // ======================
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var category = _context.Categories.Find(id);

        if (category == null)
            return NotFound();

        // Soft delete
        category.IsActive = false;

        _context.SaveChanges();

        return NoContent();
    }
}