namespace AlbanianQuora.Api.Models
{
    public class Tag
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        // Foreign Key
        public int CategoryId { get; set; }

        // Navigation Property (nullable)
        public Category? Category { get; set; }

        public List<QuestionTag> QuestionTags { get; set; } = new();
    }
}
