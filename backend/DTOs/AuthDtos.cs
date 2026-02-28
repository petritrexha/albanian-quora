using System.ComponentModel.DataAnnotations;

namespace AlbanianQuora.DTOs;

public class RegisterRequest
{
    [Required, MinLength(2), MaxLength(80)]
    public string Name { get; set; } = string.Empty;

    [Required, MinLength(3), MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    // 8–64, 1 uppercase, 1 lowercase, 1 digit, 1 special
    [Required, MinLength(8), MaxLength(64)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$",
        ErrorMessage = "Password must be 8-64 chars and include: 1 uppercase, 1 lowercase, 1 digit, 1 special character.")]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string ConfirmPassword { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required]
    public string EmailOrUsername { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class UserMeResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
}

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public UserMeResponse User { get; set; } = new();
}

public class Login2FaStartResponse
{
    public bool OtpRequired { get; set; } = true;
    public int LoginAttemptId { get; set; }
}

public class Verify2FaRequest
{
    [Required]
    public int LoginAttemptId { get; set; }

    // 6 digits
    [Required, RegularExpression(@"^\d{6}$", ErrorMessage = "Code must be 6 digits.")]
    public string Code { get; set; } = string.Empty;
}

public class Resend2FaRequest
{
    [Required]
    public int LoginAttemptId { get; set; }
}