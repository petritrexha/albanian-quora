using AlbanianQuora.Api.Models;

namespace AlbanianQuora.Api.Interfaces;

public interface IJwtTokenService
{
    string CreateToken(User user);
}