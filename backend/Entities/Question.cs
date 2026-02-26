using AlbanianQuora.Api.Entities;

namespace AlbanianQuora.Api.Models
{
    public class Question
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int Votes { get; set; }

        public int Views { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public List<QuestionTag> QuestionTags { get; set; } = new();

        public ICollection<Answer> Answers { get; set; } = new List<Answer>();

        public User User { get; set; } = null!;
        public int UserId { get; set; }
    }
}