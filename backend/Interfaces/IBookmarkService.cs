using AlbanianQuora.Api.DTOs;

namespace AlbanianQuora.Api.Interfaces
{
    public interface IBookmarkService
    {
        Task<BookmarkResponseDto> CreateBookmarkAsync(CreateBookmarkDto dto);
        Task<bool> DeleteBookmarkAsync(int id, int? currentUserId = null);
        Task<bool> DeleteBookmarkByUserAndQuestionAsync(int userId, int questionId);
        Task<List<BookmarkResponseDto>> GetBookmarksByUserAsync(int userId);
        Task<bool> IsBookmarkedAsync(int userId, int questionId);
    }
}
