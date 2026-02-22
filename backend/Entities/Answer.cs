namespace AlbanianQuora.Api.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public int Votes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int QuestionId { get; set; }
        public Question Question { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
