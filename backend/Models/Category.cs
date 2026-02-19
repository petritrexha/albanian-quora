using AlbanianQuora.Api.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    public List<Question> Questions { get; set; } = new();
    public List<Tag> Tags { get; set; } = new(); // 🔥 kjo
}
