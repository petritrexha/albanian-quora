namespace AlbanianQuora.Api.Models
{
    public class Report
    {
        public int Id { get; set; }

        public int ReporterId { get; set; }

        public string TargetType { get; set; } = string.Empty; // "Question" or "Answer"

        public int TargetId { get; set; }

        public string Reason { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending"; // Pending, Reviewed, Dismissed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
