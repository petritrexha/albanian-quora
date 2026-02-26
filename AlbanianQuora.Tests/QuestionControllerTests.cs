using AlbanianQuora.Api.Controllers;
using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Interfaces;
using AlbanianQuora.Api.Models;
using AlbanianQuora.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace AlbanianQuora.Tests
{
    public class QuestionsControllerTests
    {
        private DbContextOptions<AppDbContext> GetOptions()
        {
            return new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
        }

        private QuestionsController GetController(AppDbContext context)
        {
            var mockAnswerService = new Mock<IAnswerService>();
            return new QuestionsController(context, mockAnswerService.Object);
        }

        [Fact]
        public async Task GetQuestions_ReturnsOk()
        {
            var options = GetOptions();

            using var context = new AppDbContext(options);

            context.Questions.Add(new Question
            {
                Title = "Test",
                Description = "Desc"
            });

            await context.SaveChangesAsync();

            var controller = GetController(context);

            var result = await controller.GetQuestions(null, null);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetQuestion_IncrementsViews()
        {
            var options = GetOptions();

            using var context = new AppDbContext(options);

            context.Questions.Add(new Question
            {
                Id = 1,
                Title = "Test",
                Description = "Desc",
                Views = 0
            });

            await context.SaveChangesAsync();

            var controller = GetController(context);

            await controller.GetQuestion(1, null);

            var updated = context.Questions.First();
            Assert.Equal(1, updated.Views);
        }

        [Fact]
        public async Task GetQuestion_ReturnsNotFound()
        {
            var options = GetOptions();

            using var context = new AppDbContext(options);

            var controller = GetController(context);

            var result = await controller.GetQuestion(999, null);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_IfCategoryInvalid()
        {
            var options = GetOptions();

            using var context = new AppDbContext(options);

            var controller = GetController(context);

            var dto = new CreateQuestionDto
            {
                Title = "Test",
                Content = "Desc",
                CategoryId = 999,
                TagIds = new List<int>()
            };

            var result = await controller.Create(dto);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_CreatesQuestion()
        {
            var options = GetOptions();

            using var context = new AppDbContext(options);

            context.Categories.Add(new Category
            {
                Id = 1,
                Name = "General",
                IsActive = true
            });

            await context.SaveChangesAsync();

            var controller = GetController(context);

            var dto = new CreateQuestionDto
            {
                Title = "New",
                Content = "Desc",
                CategoryId = 1,
                TagIds = new List<int>()
            };

            var result = await controller.Create(dto);

            Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(1, context.Questions.Count());
        }

        [Fact]
        public async Task Update_ReturnsNotFound()
        {
            var options = GetOptions();

            using var context = new AppDbContext(options);

            var controller = GetController(context);

            var dto = new CreateQuestionDto
            {
                Title = "Updated",
                Content = "Updated",
                CategoryId = 1,
                TagIds = new List<int>()
            };

            var result = await controller.Update(999, dto);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Delete_RemovesQuestion()
        {
            var options = GetOptions();

            using var context = new AppDbContext(options);

            context.Questions.Add(new Question
            {
                Id = 1,
                Title = "Delete",
                Description = "Desc"
            });

            await context.SaveChangesAsync();

            var controller = GetController(context);

            var result = await controller.Delete(1);

            Assert.IsType<NoContentResult>(result);
            Assert.Empty(context.Questions);
        }
    }
}