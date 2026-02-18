using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Interfaces;
using AlbanianQuora.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AlbanianQuora.Api.Services
{
    public class BookmarkService : IBookmarkService
    {
        private readonly AppDbContext _context;

        public BookmarkService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<BookmarkResponseDto> CreateBookmarkAsync(CreateBookmarkDto dto)
        {
            // Prevent duplicate bookmarks
            var existing = await _context.Bookmarks
                .FirstOrDefaultAsync(b => b.UserId == dto.UserId && b.QuestionId == dto.QuestionId);

            if (existing != null)
                throw new InvalidOperationException("Bookmark already exists.");

            var bookmark = new Bookmark
            {
                UserId = dto.UserId,
                QuestionId = dto.QuestionId
            };

            _context.Bookmarks.Add(bookmark);
            await _context.SaveChangesAsync();

            var question = await _context.Questions.FindAsync(dto.QuestionId);

            return new BookmarkResponseDto
            {
                Id = bookmark.Id,
                UserId = bookmark.UserId,
                QuestionId = bookmark.QuestionId,
                QuestionTitle = question?.Title ?? "",
                CreatedAt = bookmark.CreatedAt
            };
        }

        public async Task<bool> DeleteBookmarkAsync(int id)
        {
            var bookmark = await _context.Bookmarks.FindAsync(id);
            if (bookmark == null) return false;

            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<BookmarkResponseDto>> GetBookmarksByUserAsync(int userId)
        {
            return await _context.Bookmarks
                .Where(b => b.UserId == userId)
                .Include(b => b.Question)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookmarkResponseDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    QuestionId = b.QuestionId,
                    QuestionTitle = b.Question != null ? b.Question.Title : "",
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> IsBookmarkedAsync(int userId, int questionId)
        {
            return await _context.Bookmarks
                .AnyAsync(b => b.UserId == userId && b.QuestionId == questionId);
        }
    }
}
