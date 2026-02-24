using AlbanianQuora.Api.DTOs;

namespace AlbanianQuora.Api.Interfaces
{
    public interface IReportService
    {
        Task<ReportResponseDto> CreateReportAsync(CreateReportDto dto);
        Task<List<ReportResponseDto>> GetAllReportsAsync();
        Task<ReportResponseDto?> UpdateReportStatusAsync(int id, string status);
    }
}
