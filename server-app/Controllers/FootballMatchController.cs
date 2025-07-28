using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ManagementApp.DTOs;
using ManagementApp.DTOs.FootballMatch;
using ManagementApp.Services;
using ManagementApp.Utils;

namespace ManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FootballMatchController : ControllerBase
    {
        private readonly IFootballMatchService _footballMatchService;

        public FootballMatchController(IFootballMatchService footballMatchService)
        {
            _footballMatchService = footballMatchService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<FootballMatchResponseDto>>> Create([FromBody] CreateFootballMatchDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<FootballMatchResponseDto>.ErrorResult("Invalid input data", ModelState));
            }

            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<FootballMatchResponseDto>.ErrorResult("Invalid user"));
            }

            var result = await _footballMatchService.CreateAsync(request, userId);
            if (result == null)
            {
                return BadRequest(ApiResponse<FootballMatchResponseDto>.ErrorResult("Failed to create football match"));
            }

            return Ok(ApiResponse<FootballMatchResponseDto>.SuccessResult(result, "Football match created successfully"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<FootballMatchResponseDto>>> Update(Guid id, [FromBody] UpdateFootballMatchDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<FootballMatchResponseDto>.ErrorResult("Invalid input data", ModelState));
            }

            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<FootballMatchResponseDto>.ErrorResult("Invalid user"));
            }

            var result = await _footballMatchService.UpdateAsync(id, request, userId);
            if (result == null)
            {
                return NotFound(ApiResponse<FootballMatchResponseDto>.ErrorResult("Football match not found"));
            }

            return Ok(ApiResponse<FootballMatchResponseDto>.SuccessResult(result, "Football match updated successfully"));
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponse<FootballMatchResponseDto>>> UpdateStatus(Guid id, [FromBody] UpdateStatusDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<FootballMatchResponseDto>.ErrorResult("Invalid input data", ModelState));
            }

            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<FootballMatchResponseDto>.ErrorResult("Invalid user"));
            }

            var result = await _footballMatchService.UpdateStatusAsync(id, request.Status, userId);
            if (result == null)
            {
                return NotFound(ApiResponse<FootballMatchResponseDto>.ErrorResult("Football match not found"));
            }

            return Ok(ApiResponse<FootballMatchResponseDto>.SuccessResult(result, "Football match status updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(Guid id)
        {
            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse.ErrorResult("Invalid user"));
            }

            var result = await _footballMatchService.DeleteAsync(id, userId);
            if (!result)
            {
                return NotFound(ApiResponse.ErrorResult("Football match not found"));
            }

            return Ok(ApiResponse.SuccessResult("Football match deleted successfully"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<FootballMatchResponseDto>>> GetById(Guid id)
        {
            var result = await _footballMatchService.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound(ApiResponse<FootballMatchResponseDto>.ErrorResult("Football match not found"));
            }

            return Ok(ApiResponse<FootballMatchResponseDto>.SuccessResult(result, "Football match retrieved successfully"));
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedFootballMatchesDto>>> GetAll([FromQuery] FootballMatchFilterDto filter)
        {
            if (filter.Page < 1) filter.Page = 1;
            if (filter.PageSize < 1 || filter.PageSize > 100) filter.PageSize = 10;

            var result = await _footballMatchService.GetAllAsync(filter);
            return Ok(ApiResponse<PagedFootballMatchesDto>.SuccessResult(result, "Football matches retrieved successfully"));
        }
    }
}
