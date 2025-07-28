using Microsoft.EntityFrameworkCore;
using ManagementApp.Data;
using ManagementApp.Models;
using ManagementApp.DTOs.CalendarEvent;

namespace ManagementApp.Services
{
    public interface ICalendarEventService
    {
        Task<CalendarEventResponseDto?> CreateAsync(CreateCalendarEventDto dto, Guid userId);
        Task<CalendarEventResponseDto?> UpdateAsync(Guid id, UpdateCalendarEventDto dto, Guid userId);
        Task<bool> DeleteAsync(Guid id, Guid userId);
        Task<CalendarEventResponseDto?> GetByIdAsync(Guid id);
        Task<PagedCalendarEventsDto> GetAllAsync(CalendarEventFilterDto filter);
    }

    public class CalendarEventService : ICalendarEventService
    {
        private readonly ApplicationDbContext _context;

        public CalendarEventService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CalendarEventResponseDto?> CreateAsync(CreateCalendarEventDto dto, Guid userId)
        {
            var calendarEvent = new CalendarEvent
            {
                Title = dto.Title,
                Description = dto.Description,
                Date = dto.Date,
                Time = dto.Time,
                Type = dto.Type,
                Color = dto.Color,
                CreatedById = userId,
                UpdatedById = userId
            };

            _context.CalendarEvents.Add(calendarEvent);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(calendarEvent.Id);
        }

        public async Task<CalendarEventResponseDto?> UpdateAsync(Guid id, UpdateCalendarEventDto dto, Guid userId)
        {
            var calendarEvent = await _context.CalendarEvents.FindAsync(id);
            if (calendarEvent == null || calendarEvent.DeleteStatus)
            {
                return null;
            }

            calendarEvent.Title = dto.Title;
            calendarEvent.Description = dto.Description;
            calendarEvent.Date = dto.Date;
            calendarEvent.Time = dto.Time;
            calendarEvent.Type = dto.Type;
            calendarEvent.Color = dto.Color;
            calendarEvent.UpdatedById = userId;
            calendarEvent.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(calendarEvent.Id);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var calendarEvent = await _context.CalendarEvents.FindAsync(id);
            if (calendarEvent == null || calendarEvent.DeleteStatus)
            {
                return false;
            }

            calendarEvent.DeleteStatus = true;
            calendarEvent.UpdatedById = userId;
            calendarEvent.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CalendarEventResponseDto?> GetByIdAsync(Guid id)
        {
            var calendarEvent = await _context.CalendarEvents
                .Include(e => e.CreatedBy)
                .Include(e => e.UpdatedBy)
                .FirstOrDefaultAsync(e => e.Id == id && !e.DeleteStatus);

            if (calendarEvent == null)
            {
                return null;
            }

            return new CalendarEventResponseDto
            {
                Id = calendarEvent.Id,
                Title = calendarEvent.Title,
                Description = calendarEvent.Description,
                Date = calendarEvent.Date,
                Time = calendarEvent.Time,
                Type = calendarEvent.Type,
                Color = calendarEvent.Color,
                CreatedAt = calendarEvent.CreatedAt,
                UpdatedAt = calendarEvent.UpdatedAt,
                CreatedBy = calendarEvent.CreatedBy?.Username ?? "Unknown",
                UpdatedBy = calendarEvent.UpdatedBy?.Username ?? "Unknown"
            };
        }

        public async Task<PagedCalendarEventsDto> GetAllAsync(CalendarEventFilterDto filter)
        {
            var query = _context.CalendarEvents
                .Include(e => e.CreatedBy)
                .Include(e => e.UpdatedBy)
                .Where(e => !e.DeleteStatus);

            // Apply filters
            if (filter.FromDate.HasValue)
            {
                query = query.Where(e => e.Date >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                query = query.Where(e => e.Date <= filter.ToDate.Value);
            }

            if (!string.IsNullOrEmpty(filter.Type))
            {
                query = query.Where(e => e.Type == filter.Type);
            }

            // Apply sorting
            query = filter.SortBy.ToLower() switch
            {
                "date" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(e => e.Date).ThenBy(e => e.Time)
                    : query.OrderByDescending(e => e.Date).ThenByDescending(e => e.Time),
                "title" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(e => e.Title) 
                    : query.OrderByDescending(e => e.Title),
                "type" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(e => e.Type) 
                    : query.OrderByDescending(e => e.Type),
                "createdat" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(e => e.CreatedAt) 
                    : query.OrderByDescending(e => e.CreatedAt),
                _ => query.OrderBy(e => e.Date).ThenBy(e => e.Time) // Default: by date ascending
            };

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize);

            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(e => new CalendarEventResponseDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    Date = e.Date,
                    Time = e.Time,
                    Type = e.Type,
                    Color = e.Color,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt,
                    CreatedBy = e.CreatedBy != null ? e.CreatedBy.Username : "Unknown",
                    UpdatedBy = e.UpdatedBy != null ? e.UpdatedBy.Username : "Unknown"
                })
                .ToListAsync();

            return new PagedCalendarEventsDto
            {
                Items = items,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = filter.Page,
                PageSize = filter.PageSize,
                HasPreviousPage = filter.Page > 1,
                HasNextPage = filter.Page < totalPages
            };
        }
    }
}
