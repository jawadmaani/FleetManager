using FleetManager.Model;
using Microsoft.EntityFrameworkCore;

namespace FleetManager.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
    public DbSet<Vehicle> Vehicles { get; set; } = null!;
    
    public DbSet<Driver> Drivers { get; set; } = null!;
    
    public DbSet<MaintenanceLog> MaintenanceLogs { get; set; } = null!;

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

            
            
            entity.HasCheckConstraint(
                "CK_Vehicles_Year",
                "\"Year\" >= 1900 AND \"Year\" <= 2100"
            );
            
            entity.Property(v => v.FuelType)
                .HasConversion<string>()   
                .IsRequired();
            
            entity.Property(v => v.Status)
                .HasConversion<string>()   
                .IsRequired();
            

            entity.Property(v => v.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

        });
        
        modelBuilder.Entity<Driver>(entity =>
        {
            entity.ToTable("Drivers");

            entity.Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");

            entity.Property(d => d.LicenseNumber)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnType("varchar(50)");

            entity.HasIndex(d=> d.LicenseNumber)
                .IsUnique();

            entity.Property(d => d.PhoneNumber)
                .IsRequired()
                .HasMaxLength(20)
                .HasColumnType("varchar(20)");    
            
            // propably change it to non-unique in future
            entity.HasIndex(p=> p.PhoneNumber)
                .IsUnique();
            
            entity.Property(d => d.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.Property(d=> d.VehicleId)
                .IsRequired(false);
            
            entity.HasOne(d => d.Vehicle)
                .WithOne(v => v.Driver)
                .HasForeignKey<Driver>(d => d.VehicleId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<MaintenanceLog>(entity =>
        {
            entity.ToTable("MaintenanceLogs");

           entity.Property(ml=>ml.MaintenanceType)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");

           entity.Property(ml => ml.MaintenanceDate)
               .IsRequired();
           
           entity.Property(ml => ml.Cost)
               .IsRequired()
               .HasColumnType("decimal(18,2)");
              
           entity.Property(ml=>ml.Description)
               .HasMaxLength(500)
               .HasColumnType("varchar(500)");
           
           
           entity.Property(ml=>ml.PerformedBy)
               .IsRequired()
               .HasMaxLength(100)
               .HasColumnType("varchar(100)");
              
            entity.Property(ml => ml.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasOne(ml => ml.Vehicle)
                .WithMany(v => v.MaintenanceLogs)
                .HasForeignKey(ml => ml.VehicleId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ml => ml.User)
                .WithMany(u => u.MaintenanceLogs)
                .HasForeignKey(ml => ml.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

    }
}