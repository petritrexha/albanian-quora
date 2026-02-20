using System.ComponentModel.DataAnnotations;

namespace AlbanianQuora.DTOs
{
    public class UpdateUserDto
    {
        [MaxLength(50)]
        public string? Username { get; set; }

        [MaxLength(100)]
        public string? FullName { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }
    }
}