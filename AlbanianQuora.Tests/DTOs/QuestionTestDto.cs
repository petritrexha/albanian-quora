namespace AlbanianQuora.Tests.DTOs
{
    public class QuestionTestDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Content { get; set; } = "";
        public int Votes { get; set; }
        public int Views { get; set; }
        public int Answers { get; set; }
        public int? BookmarkId { get; set; }
        public bool IsBookmarked { get; set; }
        public string? Category { get; set; }
        public List<string> Tags { get; set; } = new();
    }
}
