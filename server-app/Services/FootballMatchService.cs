using Microsoft.EntityFrameworkCore;
using ManagementApp.Data;
using ManagementApp.Models;
using ManagementApp.DTOs.FootballMatch;

namespace ManagementApp.Services
{
    public interface IFootballMatchService
    {
        Task<FootballMatchResponseDto?> CreateAsync(CreateFootballMatchDto dto, Guid userId);
        Task<FootballMatchResponseDto?> UpdateAsync(Guid id, UpdateFootballMatchDto dto, Guid userId);
        Task<FootballMatchResponseDto?> UpdateStatusAsync(Guid id, string status, Guid userId);
        Task<bool> DeleteAsync(Guid id, Guid userId);
        Task<FootballMatchResponseDto?> GetByIdAsync(Guid id);
        Task<PagedFootballMatchesDto> GetAllAsync(FootballMatchFilterDto filter);
    }

    public class FootballMatchService : IFootballMatchService
    {
        private readonly ApplicationDbContext _context;

        public FootballMatchService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FootballMatchResponseDto?> CreateAsync(CreateFootballMatchDto dto, Guid userId)
        {
            var match = new FootballMatch
            {
                Date = dto.Date,
                Time = dto.Time,
                Stadium = dto.Stadium,
                Team = dto.Team,
                MatchNumber = dto.MatchNumber,
                Type = dto.Type,
                TotalRevenue = dto.TotalRevenue,
                TotalCost = dto.TotalCost,
                RecordingMoneyForPhotographer = dto.RecordingMoneyForPhotographer,
                MoneyForCameraman = dto.MoneyForCameraman,
                Discount = dto.Discount,
                Status = dto.Status,
                Note = dto.Note,
                CreatedById = userId,
                UpdatedById = userId
            };

            _context.FootballMatches.Add(match);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(match.Id);
        }

        public async Task<FootballMatchResponseDto?> UpdateAsync(Guid id, UpdateFootballMatchDto dto, Guid userId)
        {
            var match = await _context.FootballMatches.FindAsync(id);
            if (match == null || match.DeleteStatus)
            {
                return null;
            }

            match.Date = dto.Date;
            match.Time = dto.Time;
            match.Stadium = dto.Stadium;
            match.Team = dto.Team;
            match.MatchNumber = dto.MatchNumber;
            match.Type = dto.Type;
            match.TotalRevenue = dto.TotalRevenue;
            match.TotalCost = dto.TotalCost;
            match.RecordingMoneyForPhotographer = dto.RecordingMoneyForPhotographer;
            match.MoneyForCameraman = dto.MoneyForCameraman;
            match.Discount = dto.Discount;
            match.Status = dto.Status;
            match.Note = dto.Note;
            match.UpdatedById = userId;
            match.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(match.Id);
        }

        public async Task<FootballMatchResponseDto?> UpdateStatusAsync(Guid id, string status, Guid userId)
        {
            var match = await _context.FootballMatches.FindAsync(id);
            if (match == null || match.DeleteStatus)
            {
                return null;
            }

            match.Status = status;
            match.UpdatedById = userId;
            match.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(match.Id);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var match = await _context.FootballMatches.FindAsync(id);
            if (match == null || match.DeleteStatus)
            {
                return false;
            }

            match.DeleteStatus = true;
            match.UpdatedById = userId;
            match.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<FootballMatchResponseDto?> GetByIdAsync(Guid id)
        {
            var match = await _context.FootballMatches
                .Include(m => m.CreatedBy)
                .Include(m => m.UpdatedBy)
                .FirstOrDefaultAsync(m => m.Id == id && !m.DeleteStatus);

            if (match == null)
            {
                return null;
            }

            return new FootballMatchResponseDto
            {
                Id = match.Id,
                Date = match.Date,
                Time = match.Time,
                Stadium = match.Stadium,
                Team = match.Team,
                MatchNumber = match.MatchNumber,
                Type = match.Type,
                TotalRevenue = match.TotalRevenue,
                TotalCost = match.TotalCost,
                RecordingMoneyForPhotographer = match.RecordingMoneyForPhotographer,
                MoneyForCameraman = match.MoneyForCameraman,
                Discount = match.Discount,
                Status = match.Status,
                Note = match.Note,
                CreatedAt = match.CreatedAt,
                UpdatedAt = match.UpdatedAt,
                CreatedBy = match.CreatedBy?.Username ?? "Unknown",
                UpdatedBy = match.UpdatedBy?.Username ?? "Unknown"
            };
        }

        public async Task<PagedFootballMatchesDto> GetAllAsync(FootballMatchFilterDto filter)
        {
            var query = _context.FootballMatches
                .Include(m => m.CreatedBy)
                .Include(m => m.UpdatedBy)
                .Where(m => !m.DeleteStatus);

            // Apply filters
            if (filter.FromDate.HasValue)
            {
                query = query.Where(m => m.Date >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                query = query.Where(m => m.Date <= filter.ToDate.Value);
            }

            if (!string.IsNullOrEmpty(filter.Stadium))
            {
                query = query.Where(m => m.Stadium.Contains(filter.Stadium));
            }

            if (!string.IsNullOrEmpty(filter.Team))
            {
                query = query.Where(m => m.Team.Contains(filter.Team));
            }

            // Combined search for stadium and team
            if (!string.IsNullOrEmpty(filter.SearchText))
            {
                query = query.Where(m => m.Stadium.Contains(filter.SearchText) || m.Team.Contains(filter.SearchText));
            }

            if (!string.IsNullOrEmpty(filter.Status))
            {
                query = query.Where(m => m.Status == filter.Status);
            }

            if (!string.IsNullOrEmpty(filter.Type))
            {
                query = query.Where(m => m.Type == filter.Type);
            }

            // Apply sorting
            query = filter.SortBy.ToLower() switch
            {
                "date" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(m => m.Date) 
                    : query.OrderByDescending(m => m.Date),
                "stadium" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(m => m.Stadium) 
                    : query.OrderByDescending(m => m.Stadium),
                "team" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(m => m.Team) 
                    : query.OrderByDescending(m => m.Team),
                "status" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(m => m.Status) 
                    : query.OrderByDescending(m => m.Status),
                "type" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(m => m.Type) 
                    : query.OrderByDescending(m => m.Type),
                "createdat" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(m => m.CreatedAt) 
                    : query.OrderByDescending(m => m.CreatedAt),
                _ => query.OrderByDescending(m => m.Date) // Default: newest first
            };

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize);

            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(m => new FootballMatchResponseDto
                {
                    Id = m.Id,
                    Date = m.Date,
                    Time = m.Time,
                    Stadium = m.Stadium,
                    Team = m.Team,
                    MatchNumber = m.MatchNumber,
                    Type = m.Type,
                    TotalRevenue = m.TotalRevenue,
                    TotalCost = m.TotalCost,
                    RecordingMoneyForPhotographer = m.RecordingMoneyForPhotographer,
                    MoneyForCameraman = m.MoneyForCameraman,
                    Discount = m.Discount,
                    Status = m.Status,
                    Note = m.Note,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt,
                    CreatedBy = m.CreatedBy != null ? m.CreatedBy.Username : "Unknown",
                    UpdatedBy = m.UpdatedBy != null ? m.UpdatedBy.Username : "Unknown"
                })
                .ToListAsync();

            return new PagedFootballMatchesDto
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
