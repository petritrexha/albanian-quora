using AlbanianQuora.Api.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // 1. ADD THIS

namespace AlbanianQuora.Api.Entities
{
    public class Answer
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public int Votes { get; set; } = 0;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        // 2. LINK QuestionId to the Question object
        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public Question? Question { get; set; }

        // 3. LINK UserId to the User object
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}