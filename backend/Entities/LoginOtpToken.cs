using System.ComponentModel.DataAnnotations;

namespace AlbanianQuora.Api.Models;

public class LoginOtpToken
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public byte[] CodeHash { get; set; } = Array.Empty<byte>();

    [Required]
    public byte[] Salt { get; set; } = Array.Empty<byte>();

    public DateTime ExpiresAtUtc { get; set; }

    public bool IsUsed { get; set; }
    public DateTime? UsedAtUtc { get; set; }

    public bool IsInvalidated { get; set; }
    public DateTime? InvalidatedAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime LastSentAtUtc { get; set; } = DateTime.UtcNow;
    public int ResendCount { get; set; }
}