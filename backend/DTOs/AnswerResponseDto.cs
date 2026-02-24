public class AnswerResponseDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Votes { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
