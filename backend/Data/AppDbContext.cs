using Microsoft.EntityFrameworkCore;
using AlbanianQuora.Api.Models;

namespace AlbanianQuora.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Question> Questions => Set<Question>();
        public DbSet<Bookmark> Bookmarks => Set<Bookmark>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<Report> Reports => Set<Report>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Prevent duplicate bookmarks for same user + question
            modelBuilder.Entity<Bookmark>()
                .HasIndex(b => new { b.UserId, b.QuestionId })
                .IsUnique();

            // Bookmark -> Question relationship
            modelBuilder.Entity<Bookmark>()
                .HasOne(b => b.Question)
                .WithMany()
                .HasForeignKey(b => b.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
