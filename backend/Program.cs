using AlbanianQuora.Api.Data;
using AlbanianQuora.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =======================
// SERVICES
// =======================

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// =======================
// PIPELINE
// =======================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// =======================
// SEED DATA
// =======================

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    SeedCategories(context);
    SeedTags(context);
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();


// =======================
// SEED METHODS
// =======================

void SeedCategories(AppDbContext context)
{
    var defaultCategories = new[]
    {
        "Programim",
        "Teknologji",
        "Shkencë",
        "Biznes",
        "Fe & Religjion",
        "Shoqëri",
        "Shëndet"
    };

    foreach (var name in defaultCategories)
    {
        if (!context.Categories.Any(c => c.Name == name))
        {
            context.Categories.Add(new Category
            {
                Name = name,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
        }
    }

    context.SaveChanges();
}

void SeedTags(AppDbContext context)
{
    var tagData = new Dictionary<string, string[]>
    {
        {
            "Programim",
            new[]
            {
                "C#", "Java", "JavaScript", "Python", "C++",
                "PHP", "Go", "Rust", "TypeScript", "SQL",
                "React", "Angular", "Node.js", ".NET", "Spring Boot"
            }
        },
        { "Teknologji", new[] { "AI", "Cybersecurity", "Cloud", "Blockchain" } },
        { "Biznes", new[] { "Marketing", "Startup", "Investim" } },
        { "Shkencë", new[] { "Matematikë", "Fizikë", "Biologji" } },
        { "Fe & Religjion", new[] { "Islam", "Teologji", "Hadith" } },
        { "Shoqëri", new[] { "Politikë", "Media", "Kulturë" } },
        { "Shëndet", new[] { "Fitness", "Ushqim", "Psikologji" } }
    };

    foreach (var entry in tagData)
    {
        var category = context.Categories
            .FirstOrDefault(c => c.Name == entry.Key);

        if (category == null)
            continue;

        foreach (var tagName in entry.Value)
        {
            if (!context.Tags.Any(t => t.Name == tagName))
            {
                context.Tags.Add(new Tag
                {
                    Name = tagName,
                    CategoryId = category.Id
                });
            }
        }
    }

    context.SaveChanges();
}