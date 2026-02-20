namespace AlbanianQuora.DTOs
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string? FullName { get; set; }
        public string? Bio { get; set; }

        public List<UserQuestionDto> Questions { get; set; } = new();
        public List<UserAnswerDto> Answers { get; set; } = new(); // për tani empty (s’ke Answer entity ende)
    }

    public class UserQuestionDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public DateTime CreatedAt { get; set; }
    }

    public class UserAnswerDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = "";
        public int QuestionId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}