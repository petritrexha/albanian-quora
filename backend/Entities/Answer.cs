using AlbanianQuora.Api.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace AlbanianQuora.Api.Entities
{
    public class Answer
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public int Votes { get; set; } = 0;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        // Foreign Key
        public int QuestionId { get; set; }
        public Question? Question { get; set; }

        // Foreign Key
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}