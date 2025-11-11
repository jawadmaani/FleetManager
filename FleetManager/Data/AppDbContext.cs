using FleetManager.Model;
using Microsoft.EntityFrameworkCore;

namespace FleetManager.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasIndex(u => u.Username)
                .IsUnique();

            entity.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(u => u.passwordHash)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(u => u.role)
                .HasConversion<string>()   
                .IsRequired();

            entity.Property(u => u.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("RefreshTokens");

            entity.Property(rt => rt.RefreshTokenHash)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(rt => rt.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(rt => rt.User)
                .WithOne(u => u.refreshToken)
                .HasForeignKey<RefreshToken>(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}