using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ManagementApp.DTOs;
using ManagementApp.DTOs.CalendarEvent;
using ManagementApp.Services;
using ManagementApp.Utils;

namespace ManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CalendarEventController : ControllerBase
    {
        private readonly ICalendarEventService _calendarEventService;

        public CalendarEventController(ICalendarEventService calendarEventService)
        {
            _calendarEventService = calendarEventService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<CalendarEventResponseDto>>> Create([FromBody] CreateCalendarEventDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<CalendarEventResponseDto>.ErrorResult("Invalid input data", ModelState));
            }

            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<CalendarEventResponseDto>.ErrorResult("Invalid user"));
            }

            var result = await _calendarEventService.CreateAsync(request, userId);
            if (result == null)
            {
                return BadRequest(ApiResponse<CalendarEventResponseDto>.ErrorResult("Failed to create calendar event"));
            }

            return Ok(ApiResponse<CalendarEventResponseDto>.SuccessResult(result, "Calendar event created successfully"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<CalendarEventResponseDto>>> Update(Guid id, [FromBody] UpdateCalendarEventDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<CalendarEventResponseDto>.ErrorResult("Invalid input data", ModelState));
            }

            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<CalendarEventResponseDto>.ErrorResult("Invalid user"));
            }

            var result = await _calendarEventService.UpdateAsync(id, request, userId);
            if (result == null)
            {
                return NotFound(ApiResponse<CalendarEventResponseDto>.ErrorResult("Calendar event not found"));
            }

            return Ok(ApiResponse<CalendarEventResponseDto>.SuccessResult(result, "Calendar event updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(Guid id)
        {
            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse.ErrorResult("Invalid user"));
            }

            var result = await _calendarEventService.DeleteAsync(id, userId);
            if (!result)
            {
                return NotFound(ApiResponse.ErrorResult("Calendar event not found"));
            }

            return Ok(ApiResponse.SuccessResult("Calendar event deleted successfully"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CalendarEventResponseDto>>> GetById(Guid id)
        {
            var result = await _calendarEventService.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound(ApiResponse<CalendarEventResponseDto>.ErrorResult("Calendar event not found"));
            }

            return Ok(ApiResponse<CalendarEventResponseDto>.SuccessResult(result, "Calendar event retrieved successfully"));
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedCalendarEventsDto>>> GetAll([FromQuery] CalendarEventFilterDto filter)
        {
            if (filter.Page < 1) filter.Page = 1;
            if (filter.PageSize < 1 || filter.PageSize > 100) filter.PageSize = 10;

            var result = await _calendarEventService.GetAllAsync(filter);
            return Ok(ApiResponse<PagedCalendarEventsDto>.SuccessResult(result, "Calendar events retrieved successfully"));
        }
    }
}
