using AlbanianQuora.Api.Models;

namespace AlbanianQuora.Api.Entities
{
    public class QuestionView
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public int? UserId { get; set; }
        public string? IpAddress { get; set; }
        public DateTime ViewedAt { get; set; }

        public Question Question { get; set; } = null!;
        public User? User { get; set; }
    }
}
