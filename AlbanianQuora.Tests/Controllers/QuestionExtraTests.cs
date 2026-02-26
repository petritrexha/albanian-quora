using Xunit;
using Microsoft.EntityFrameworkCore;
using AlbanianQuora.Api.Controllers;
using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AlbanianQuora.Tests.Controllers
{
    public class QuestionsExtraTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "ExtraQuestionsDb_" + System.Guid.NewGuid())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetQuestion_ReturnsNotFound_WhenMissing()
        {
            var context = GetDbContext();
            var controller = new QuestionsController(context);

            var result = await controller.GetQuestion(999, null);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteQuestion_ReturnsNotFound_WhenMissing()
        {
            var context = GetDbContext();
            var controller = new QuestionsController(context);

            var result = await controller.Delete(999);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
