using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using AlbanianQuora.Api.Controllers;
using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.Models;
using AlbanianQuora.Api.DTOs;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

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

            var controller = new QuestionsController(context);

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

            var controller = new QuestionsController(context);

            await controller.GetQuestion(1, null);

            var updated = context.Questions.First();
            Assert.Equal(1, updated.Views);
        }

        [Fact]
        public async Task GetQuestion_ReturnsNotFound()
        {
            var options = GetOptions();

            using var context = new AppDbContext(options);

            var controller = new QuestionsController(context);

            var result = await controller.GetQuestion(999, null);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_IfCategoryInvalid()
        {
            var options = GetOptions();

            using var context = new AppDbContext(options);

            var controller = new QuestionsController(context);

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

            var controller = new QuestionsController(context);

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

            var controller = new QuestionsController(context);

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

            var controller = new QuestionsController(context);

            var result = await controller.Delete(1);

            Assert.IsType<NoContentResult>(result);
            Assert.Empty(context.Questions);
        }
    }
}

//using Xunit;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.AspNetCore.Mvc;
//using AlbanianQuora.Api.Controllers;
//using AlbanianQuora.Api.Data;
//using AlbanianQuora.Api.Models;
//using AlbanianQuora.Api.DTOs;
//using System;
//using System.Threading.Tasks;
//using System.Linq;
//using System.Collections.Generic;

//namespace AlbanianQuora.Tests
//{
//    public class QuestionsControllerTests
//    {
//        // Helper: get in-memory options
//        private DbContextOptions<AppDbContext> GetOptions()
//        {
//            return new DbContextOptionsBuilder<AppDbContext>()
//                .UseInMemoryDatabase(Guid.NewGuid().ToString())
//                .Options;
//        }

//        [Fact]
//        public async Task GetQuestion_ReturnsOk_WhenQuestionExists()
//        {
//            var options = GetOptions();

//            using (var context = new AppDbContext(options))
//            {
//                context.Questions.Add(new Question
//                {
//                    Id = 1,
//                    Title = "Test Question",
//                    Description = "Test Description"
//                });

//                await context.SaveChangesAsync();
//            }

//            using (var context = new AppDbContext(options))
//            {
//                var controller = new QuestionsController(context);

//                var result = await controller.GetQuestion(1, null);

//                var okResult = Assert.IsType<OkObjectResult>(result);
//                var question = okResult.Value as dynamic;

//                Assert.Equal("Test Question", (string)question.Title);
//            }
//        }

//        [Fact]
//        public async Task GetQuestion_ReturnsNotFound_WhenQuestionDoesNotExist()
//        {
//            var options = GetOptions();

//            using (var context = new AppDbContext(options))
//            {
//                var controller = new QuestionsController(context);

//                var result = await controller.GetQuestion(999, null);

//                Assert.IsType<NotFoundResult>(result);
//            }
//        }

//        [Fact]
//        public async Task Create_ReturnsBadRequest_WhenCategoryInvalid()
//        {
//            var options = GetOptions();

//            using (var context = new AppDbContext(options))
//            {
//                var controller = new QuestionsController(context);

//                var dto = new CreateQuestionDto
//                {
//                    Title = "New Question",
//                    Content = "Some Content",
//                    CategoryId = 999, // invalid
//                    TagIds = new List<int>()
//                };

//                var result = await controller.Create(dto);

//                Assert.IsType<BadRequestObjectResult>(result);
//            }
//        }

//        [Fact]
//        public async Task Create_CreatesQuestion_WhenCategoryValid()
//        {
//            var options = GetOptions();

//            using (var context = new AppDbContext(options))
//            {
//                context.Categories.Add(new Category
//                {
//                    Id = 1,
//                    Name = "General",
//                    IsActive = true
//                });

//                await context.SaveChangesAsync();

//                var controller = new QuestionsController(context);

//                var dto = new CreateQuestionDto
//                {
//                    Title = "Valid Question",
//                    Content = "Valid Content",
//                    CategoryId = 1,
//                    TagIds = new List<int>()
//                };

//                var result = await controller.Create(dto);

//                Assert.IsType<CreatedAtActionResult>(result);
//                Assert.Equal(1, context.Questions.Count());
//            }
//        }

//        [Fact]
//        public async Task Delete_RemovesQuestion_WhenExists()
//        {
//            var options = GetOptions();

//            using (var context = new AppDbContext(options))
//            {
//                context.Questions.Add(new Question
//                {
//                    Id = 1,
//                    Title = "To Delete",
//                    Description = "Delete me"
//                });

//                await context.SaveChangesAsync();
//            }

//            using (var context = new AppDbContext(options))
//            {
//                var controller = new QuestionsController(context);

//                var result = await controller.Delete(1);

//                Assert.IsType<NoContentResult>(result);
//                Assert.Empty(context.Questions);
//            }
//        }

//        [Fact]
//        public async Task GetQuestions_FiltersByCategoryAndUserBookmarks()
//        {
//            var options = GetOptions();

//            using (var context = new AppDbContext(options))
//            {
//                // Arrange: Add categories, questions, bookmarks
//                context.Categories.Add(new Category { Id = 1, Name = "General", IsActive = true });
//                context.Categories.Add(new Category { Id = 2, Name = "Tech", IsActive = true });

//                context.Questions.Add(new Question
//                {
//                    Id = 1,
//                    Title = "Q1",
//                    Description = "Desc1",
//                    CategoryId = 1
//                });

//                context.Questions.Add(new Question
//                {
//                    Id = 2,
//                    Title = "Q2",
//                    Description = "Desc2",
//                    CategoryId = 2
//                });

//                context.Bookmarks.Add(new Bookmark { Id = 1, UserId = 42, QuestionId = 1 });

//                await context.SaveChangesAsync();
//            }

//            using (var context = new AppDbContext(options))
//            {
//                var controller = new QuestionsController(context);

//                // Act: filter by categoryId=1, userId=42
//                var result = await controller.GetQuestions(1, 42);

//                // Assert
//                var okResult = Assert.IsType<OkObjectResult>(result);

//                // ✅ Cast to dynamic for anonymous object access
//                var list = okResult.Value as IEnumerable<dynamic>;
//                Assert.Single(list);

//                var first = list.First();
//                Assert.Equal("Q1", (string)first.Title);
//                Assert.True((bool)first.IsBookmarked);
//                Assert.Equal(1, (int)first.BookmarkId);
//            }
//        }
//    }
//}