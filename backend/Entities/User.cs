using AlbanianQuora.Api.Entities;
using System.ComponentModel.DataAnnotations;

namespace AlbanianQuora.Api.Models;

public enum UserRole
{
    User = 0,
    Admin = 1
}

public class User
{
    public int Id { get; set; }

    [Required, MinLength(2), MaxLength(80)]
    public string Name { get; set; } = string.Empty;

    [Required, MinLength(3), MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

    [Required]
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

    [MaxLength(500)]
    public string? Bio { get; set; }

    public UserRole Role { get; set; } = UserRole.User;

    public ICollection<Question> Questions { get; set; } = new List<Question>();

    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}