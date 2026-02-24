using Xunit;
using Microsoft.EntityFrameworkCore;
using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.Models;
using AlbanianQuora.Api.Controllers;
using AlbanianQuora.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace AlbanianQuora.Tests.Controllers
{
    public class CategoriesControllerTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("CategoriesDb_" + System.Guid.NewGuid())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public void GetAll_ReturnsOnlyActiveCategories()
        {
            var context = GetDbContext();

            context.Categories.Add(new Category { Name = "Active", IsActive = true });
            context.Categories.Add(new Category { Name = "Inactive", IsActive = false });
            context.SaveChanges();

            var controller = new CategoriesController(context);

            var result = controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var categories = Assert.IsAssignableFrom<System.Collections.Generic.List<Category>>(okResult.Value);

            Assert.Single(categories); // only active
        }

        [Fact]
        public void Create_ReturnsOk_AndAddsCategory()
        {
            var context = GetDbContext();
            var controller = new CategoriesController(context);

            var dto = new CreateCategoryDto
            {
                Name = "Science"
            };

            var result = controller.Create(dto);

            Assert.IsType<OkObjectResult>(result);
            Assert.Single(context.Categories);
        }

        [Fact]
        public void Delete_ReturnsNotFound_WhenMissing()
        {
            var context = GetDbContext();
            var controller = new CategoriesController(context);

            var result = controller.Delete(999);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}