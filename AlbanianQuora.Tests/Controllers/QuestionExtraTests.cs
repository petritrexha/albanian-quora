using AlbanianQuora.Api.Controllers;
using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.Interfaces;
using AlbanianQuora.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Threading.Tasks;
using Xunit;

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
            var mockAnswerService = new Mock<IAnswerService>();

            var controller = new QuestionsController(context, mockAnswerService.Object);

            var result = await controller.GetQuestion(999, null);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteQuestion_ReturnsNotFound_WhenMissing()
        {
            var context = GetDbContext();
            var mockAnswerService = new Mock<IAnswerService>();

            var controller = new QuestionsController(context, mockAnswerService.Object);

            var result = await controller.Delete(999);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}