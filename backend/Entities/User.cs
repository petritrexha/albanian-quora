using System.ComponentModel.DataAnnotations;

namespace AlbanianQuora.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? FullName { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }

        // Per JWT login (nese e keni auth)
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Nav
        public ICollection<AlbanianQuora.Api.Models.Question> Questions { get; set; } = new List<AlbanianQuora.Api.Models.Question>();
    }
}