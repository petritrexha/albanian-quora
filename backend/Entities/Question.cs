using AlbanianQuora.Entities;

namespace AlbanianQuora.Api.Models
{
    public class Question
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        // Persisted content for the question. Older code used "Description"; newer code used "Content".
        // We keep Description as the canonical field and map DTOs' Content to it.
        public string Description { get; set; } = string.Empty;

        public int Votes { get; set; }

        public int Views { get; set; } = 0;

        public int Answers { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Optional categorization / tagging support
        public int CategoryId { get; set; }   
        public Category Category { get; set; } = null!; 

        public List<QuestionTag> QuestionTags { get; set; } = new();

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
