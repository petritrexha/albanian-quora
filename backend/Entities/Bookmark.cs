namespace AlbanianQuora.Api.Models
{
    public class Bookmark
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int QuestionId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Question? Question { get; set; }
    }
}
