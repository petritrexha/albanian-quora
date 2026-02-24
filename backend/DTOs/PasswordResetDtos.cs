using System.ComponentModel.DataAnnotations;

namespace AlbanianQuora.DTOs;

public class ForgotPasswordRequest
{
    [Required, EmailAddress, MaxLength(120)]
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;

    [Required, MinLength(8), MaxLength(64)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$",
        ErrorMessage = "Password must be 8-64 chars and include: 1 uppercase, 1 lowercase, 1 digit, 1 special character.")]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string ConfirmPassword { get; set; } = string.Empty;
}