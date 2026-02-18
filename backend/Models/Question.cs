using AlbanianQuora.Api.Models;

public class Question
{
    public int Id { get; set; }

    public string Title { get; set; } = "";

    public string Content { get; set; } = "";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int CategoryId { get; set; }

    public Category? Category { get; set; }

    public List<QuestionTag> QuestionTags { get; set; } = new();
}
