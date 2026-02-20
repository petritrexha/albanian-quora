using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Interfaces;
using AlbanianQuora.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AlbanianQuora.Api.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ReportResponseDto> CreateReportAsync(CreateReportDto dto)
        {
            var report = new Report
            {
                ReporterId = dto.ReporterId,
                TargetType = dto.TargetType,
                TargetId = dto.TargetId,
                Reason = dto.Reason
            };

            _context.Reports.Add(report);
            await _context.SaveChangesAsync();

            return new ReportResponseDto
            {
                Id = report.Id,
                ReporterId = report.ReporterId,
                TargetType = report.TargetType,
                TargetId = report.TargetId,
                Reason = report.Reason,
                Status = report.Status,
                CreatedAt = report.CreatedAt
            };
        }

        public async Task<List<ReportResponseDto>> GetAllReportsAsync()
        {
            return await _context.Reports
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReportResponseDto
                {
                    Id = r.Id,
                    ReporterId = r.ReporterId,
                    TargetType = r.TargetType,
                    TargetId = r.TargetId,
                    Reason = r.Reason,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<ReportResponseDto?> UpdateReportStatusAsync(int id, string status)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report == null) return null;

            report.Status = status;
            await _context.SaveChangesAsync();

            return new ReportResponseDto
            {
                Id = report.Id,
                ReporterId = report.ReporterId,
                TargetType = report.TargetType,
                TargetId = report.TargetId,
                Reason = report.Reason,
                Status = report.Status,
                CreatedAt = report.CreatedAt
            };
        }
    }
}
