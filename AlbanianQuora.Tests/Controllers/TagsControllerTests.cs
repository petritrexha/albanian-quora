using Xunit;
using Microsoft.EntityFrameworkCore;
using AlbanianQuora.Api.Controllers;
using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace AlbanianQuora.Tests.Controllers
{
    public class TagsControllerTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("TagsDb_" + System.Guid.NewGuid())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public void GetAll_ReturnsOk()
        {
            var context = GetDbContext();

            context.Tags.Add(new Tag
            {
                Name = "CSharp",
                CategoryId = 1
            });

            context.SaveChanges();

            var controller = new TagsController(context);

            var result = controller.GetAll(null);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var tags = Assert.IsAssignableFrom<System.Collections.IEnumerable>(okResult.Value);

            Assert.Single(tags);
        }

        [Fact]
        public void Create_ReturnsOk()
        {
            var context = GetDbContext();
            var controller = new TagsController(context);

            var tag = new Tag
            {
                Name = "DotNet",
                CategoryId = 2
            };

            var result = controller.Create(tag);

            Assert.IsType<OkObjectResult>(result);
            Assert.Single(context.Tags);
        }
    }
}