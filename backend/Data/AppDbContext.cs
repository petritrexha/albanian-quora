using AlbanianQuora.Api.Models;
using AlbanianQuora.Entities;
using Microsoft.EntityFrameworkCore;

namespace AlbanianQuora.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Question> Questions => Set<Question>();

        // Bookmark/notification/report entities (HEAD)
        public DbSet<Bookmark> Bookmarks => Set<Bookmark>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<Report> Reports => Set<Report>();
        public DbSet<User> Users => Set<User>();

        // Category/tag support (incoming)
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<QuestionTag> QuestionTags => Set<QuestionTag>();

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

            // QuestionTag composite key and relationships
            modelBuilder.Entity<QuestionTag>()
                .HasKey(qt => new { qt.QuestionId, qt.TagId });

            modelBuilder.Entity<QuestionTag>()
                .HasOne(qt => qt.Question)
                .WithMany(q => q.QuestionTags)
                .HasForeignKey(qt => qt.QuestionId);

            modelBuilder.Entity<QuestionTag>()
                .HasOne(qt => qt.Tag)
                .WithMany(t => t.QuestionTags)
                .HasForeignKey(qt => qt.TagId);

            modelBuilder.Entity<Tag>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Tags)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Question -> User relationship
            modelBuilder.Entity<Question>()
                .HasOne(q => q.User)
                .WithMany(u => u.Questions)
                .HasForeignKey(q => q.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
