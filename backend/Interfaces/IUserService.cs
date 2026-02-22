using AlbanianQuora.DTOs;

namespace AlbanianQuora.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto?> GetProfileAsync(int id);
        Task<bool> UpdateProfileAsync(int id, UpdateUserDto dto);
    }
}