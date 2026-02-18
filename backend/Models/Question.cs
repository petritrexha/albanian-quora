namespace AlbanianQuora.Api.Models
{
    public class Question
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int Votes { get; set; }

        public int Views { get; set; } = 0;

        public int Answers { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
