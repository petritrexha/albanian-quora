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
    }
}
