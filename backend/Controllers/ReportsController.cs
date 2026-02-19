using AlbanianQuora.Api.DTOs;
using AlbanianQuora.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlbanianQuora.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        // POST api/reports
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateReportDto dto)
        {
            var result = await _reportService.CreateReportAsync(dto);
            return CreatedAtAction(nameof(GetAll), null, result);
        }

        // GET api/reports
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reports = await _reportService.GetAllReportsAsync();
            return Ok(reports);
        }

        // PATCH api/reports/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var result = await _reportService.UpdateReportStatusAsync(id, request.Status);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
