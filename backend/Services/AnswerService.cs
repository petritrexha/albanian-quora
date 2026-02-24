using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Entities;
using AlbanianQuora.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlbanianQuora.Api.Services
{
    public class AnswerService : IAnswerService
    {
        private readonly AppDbContext _context;

        public AnswerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AnswerResponseDto>> GetByQuestionId(int questionId)
        {
            return await _context.Answers
                .Where(a => a.QuestionId == questionId)
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new AnswerResponseDto
                {
                    Id = a.Id,
                    Content = a.Content,
                    Votes = a.Votes,
                    AuthorName = a.User != null ? a.User.Name : "Unknown",
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();
        }

        public async Task CreateAnswer(int userId, CreateAnswerDto dto)
        {
            var answer = new Answer
            {
                Content = dto.Content ?? string.Empty,
                QuestionId = dto.QuestionId,
                UserId = userId
            };

            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();
        }
    }
}