using Xunit;
using Moq;
using AlbanianQuora.Api.Controllers;
using AlbanianQuora.Api.Interfaces;
using AlbanianQuora.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlbanianQuora.Tests.Controllers
{
    public class BookmarksControllerTests
    {
        [Fact]
        public async Task GetByUser_ReturnsOk()
        {
            var mockService = new Mock<IBookmarkService>();

            mockService
                .Setup(s => s.GetBookmarksByUserAsync(1))
                .ReturnsAsync(new List<BookmarkResponseDto>());

            var controller = new BookmarksController(mockService.Object);

            var result = await controller.GetByUser(1);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenNotDeleted()
        {
            var mockService = new Mock<IBookmarkService>();

            mockService
                .Setup(s => s.DeleteBookmarkAsync(1))
                .ReturnsAsync(false);

            var controller = new BookmarksController(mockService.Object);

            var result = await controller.Delete(1);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
