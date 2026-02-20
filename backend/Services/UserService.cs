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
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return null;

            return new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Bio = user.Bio,
                Questions = user.Questions
                    .OrderByDescending(q => q.CreatedAt)
                    .Select(q => new UserQuestionDto
                    {
                        Id = q.Id,
                        Title = q.Title,
                        CreatedAt = q.CreatedAt
                    })
                    .ToList(),
                Answers = new() // s’ke Answer entity ende
            };
        }

        public async Task<bool> UpdateProfileAsync(int id, UpdateUserDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return false;

            if (!string.IsNullOrWhiteSpace(dto.Username))
                user.Username = dto.Username.Trim();

            if (!string.IsNullOrWhiteSpace(dto.FullName))
                user.FullName = dto.FullName.Trim();

            if (dto.Bio != null)
                user.Bio = dto.Bio.Trim();

            await _db.SaveChangesAsync();
            return true;
        }
    }
}