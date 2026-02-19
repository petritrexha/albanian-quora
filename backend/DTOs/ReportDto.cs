namespace AlbanianQuora.Api.DTOs
{
    public class CreateReportDto
    {
        public int ReporterId { get; set; }
        public string TargetType { get; set; } = string.Empty; // "Question" or "Answer"
        public int TargetId { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class ReportResponseDto
    {
        public int Id { get; set; }
        public int ReporterId { get; set; }
        public string TargetType { get; set; } = string.Empty;
        public int TargetId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
