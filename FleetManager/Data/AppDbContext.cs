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
    
    public DbSet<Vehicle> Vehicles { get; set; }

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
                .HasMaxLength(50)
                .HasColumnType("varchar(50)");

            entity.Property(u => u.passwordHash)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");

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
                .HasMaxLength(256)
                .HasColumnType("varchar(256)");

            entity.Property(rt => rt.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(rt => rt.User)
                .WithOne(u => u.refreshToken)
                .HasForeignKey<RefreshToken>(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {

            entity.ToTable("Vehicles");
            
            
            entity.Property(v => v.PlateNumber)
                .IsRequired()
                .HasMaxLength(20)
                .HasColumnType("varchar(20)");
            
            entity.HasIndex(v=> v.PlateNumber)
                .IsUnique();

            entity.Property(v => v.Model)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");

            entity.Property(v => v.Manufacturer)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");
            
            entity.Property(v => v.Odometer)
                .HasColumnType("bigint");

            
            
            entity.HasCheckConstraint("CK_Vehicles_Year", "Year >= 1900 AND Year <= 2100");
            
            entity.Property(v => v.FuelType)
                .HasConversion<string>()   
                .IsRequired();
            
            entity.Property(v => v.Status)
                .HasConversion<string>()   
                .IsRequired();
            

            entity.Property(v => v.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

        });


    }
}