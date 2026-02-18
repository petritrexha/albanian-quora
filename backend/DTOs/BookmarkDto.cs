namespace AlbanianQuora.Api.DTOs
{
    public class CreateBookmarkDto
    {
        public int UserId { get; set; }
        public int QuestionId { get; set; }
    }

    public class BookmarkResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int QuestionId { get; set; }
        public string QuestionTitle { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
