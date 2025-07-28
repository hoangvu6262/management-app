using Microsoft.EntityFrameworkCore;
using ManagementApp.Models;

namespace ManagementApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<FootballMatch> FootballMatches { get; set; }
        public DbSet<CalendarEvent> CalendarEvents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.Username).IsUnique();
            });

            // RefreshToken configuration
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasOne(rt => rt.User)
                      .WithMany(u => u.RefreshTokens)
                      .HasForeignKey(rt => rt.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // FootballMatch configuration
            modelBuilder.Entity<FootballMatch>(entity =>
            {
                entity.HasOne(fm => fm.CreatedBy)
                      .WithMany(u => u.CreatedFootballMatches)
                      .HasForeignKey(fm => fm.CreatedById)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(fm => fm.UpdatedBy)
                      .WithMany(u => u.UpdatedFootballMatches)
                      .HasForeignKey(fm => fm.UpdatedById)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasQueryFilter(fm => !fm.DeleteStatus);
            });

            // CalendarEvent configuration
            modelBuilder.Entity<CalendarEvent>(entity =>
            {
                entity.HasOne(ce => ce.CreatedBy)
                      .WithMany(u => u.CreatedCalendarEvents)
                      .HasForeignKey(ce => ce.CreatedById)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(ce => ce.UpdatedBy)
                      .WithMany(u => u.UpdatedCalendarEvents)
                      .HasForeignKey(ce => ce.UpdatedById)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasQueryFilter(ce => !ce.DeleteStatus);
            });
        }
    }
}
