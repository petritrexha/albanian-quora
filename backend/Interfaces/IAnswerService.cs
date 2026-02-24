using AlbanianQuora.Api.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlbanianQuora.Api.Services
{
    public interface IAnswerService
    {
        Task<List<AnswerResponseDto>> GetByQuestionId(int questionId);
        Task CreateAnswer(int userId, CreateAnswerDto dto);
    }
}
