using AlbanianQuora.Api.Data;
using AlbanianQuora.DTOs;
using AlbanianQuora.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlbanianQuora.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;

        public UserService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<UserProfileDto?> GetProfileAsync(int id)
        {
            var user = await _db.Users
                .Include(u => u.Questions)
                .Include(u => u.Answers)
                    .ThenInclude(a => a.Question)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return null;

            return new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.Name,
                Bio = user.Bio,
<<<<<<< HEAD
                JoinedAt = user.CreatedAtUtc,

                Questions = user.Questions
                    .OrderByDescending(q => q.CreatedAt)
                    .Select(q => new UserQuestionDto
                    {
                        Id = q.Id,
                        Title = q.Title,
                        CreatedAt = q.CreatedAt
                    })
                    .ToList(),

                Answers = user.Answers
                    .OrderByDescending(a => a.CreatedAtUtc)
                    .Select(a => new UserAnswerDto
                    {
                        Id = a.Id,
                        Content = a.Content,
                        QuestionId = a.QuestionId,
                        QuestionTitle = a.Question?.Title ?? string.Empty,
                        CreatedAt = a.CreatedAtUtc
                    })
                    .ToList()
=======

                // 1. FOR USER: Use the name from User.cs (CreatedAtUtc)
                JoinedAt = user.CreatedAtUtc,

                Questions = user.Questions
        .OrderByDescending(q => q.CreatedAt)
        .Select(q => new UserQuestionDto
        {
            Id = q.Id,
            Title = q.Title,
            CreatedAt = q.CreatedAt
        })
        .ToList(),

                Answers = user.Answers
        .OrderByDescending(a => a.CreatedAtUtc)
        .Select(a => new UserAnswerDto
        {
            Id = a.Id,
            Content = a.Content,
            QuestionId = a.QuestionId,
            QuestionTitle = a.Question?.Title,

            // 2. FOR ANSWER: Use the name from Answer.cs (CreatedAt)
            CreatedAt = a.CreatedAtUtc
        })
        .ToList()
>>>>>>> origin/develop
            };
        }

        public async Task<bool> UpdateProfileAsync(int id, UpdateUserDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return false;

            if (!string.IsNullOrWhiteSpace(dto.Username))
                user.Username = dto.Username.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Name))
                user.Name = dto.Name.Trim();

            if (dto.Bio != null)
                user.Bio = dto.Bio.Trim();

            await _db.SaveChangesAsync();
            return true;
        }
    }
}

//using AlbanianQuora.Api.Data;
//using AlbanianQuora.DTOs;
//using AlbanianQuora.Interfaces;
//using Microsoft.EntityFrameworkCore;

//namespace AlbanianQuora.Services
//{
//    public class UserService : IUserService
//    {
//        private readonly AppDbContext _db;

//        public UserService(AppDbContext db)
//        {
//            _db = db;
//        }

//        public async Task<UserProfileDto?> GetProfileAsync(int id)
//        {
//            var user = await _db.Users
//                .Include(u => u.Questions)
//                .Include(u => u.Answers)
//                    .ThenInclude(a => a.Question)
//                .FirstOrDefaultAsync(u => u.Id == id);

//            if (user == null) return null;

//            return new UserProfileDto
//            {
//                Id = user.Id,
//                Username = user.Username,
//                Email = user.Email,
//                FullName = user.Name,
//                    Bio = user.Bio,
//                    JoinedAt = user.CreatedAtUtc,
//                Questions = user.Questions
//                    .OrderByDescending(q => q.CreatedAt)
//                    .Select(q => new UserQuestionDto
//                    {
//                        Id = q.Id,
//                        Title = q.Title,
//                        CreatedAt = q.CreatedAt
//                    })
//                    .ToList(),
//                    Answers = user.Answers
//                        .OrderByDescending(a => a.CreatedAtUtc)
//                        .Select(a => new UserAnswerDto
//                        {
//                            Id = a.Id,
//                            Content = a.Content,
//                            QuestionId = a.QuestionId,
//                            QuestionTitle = a.Question.Title,
//                            CreatedAt = a.CreatedAtUtc
//                        })
//                        .ToList()
//            };
//        }

//        public async Task<bool> UpdateProfileAsync(int id, UpdateUserDto dto)
//        {
//            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
//            if (user == null) return false;

//            if (!string.IsNullOrWhiteSpace(dto.Username))
//                user.Username = dto.Username.Trim();

//            if (!string.IsNullOrWhiteSpace(dto.Name))
//                user.Name = dto.Name.Trim();

//            if (dto.Bio != null)
//                user.Bio = dto.Bio.Trim();

//            await _db.SaveChangesAsync();
//            return true;
//        }
//    }
//}