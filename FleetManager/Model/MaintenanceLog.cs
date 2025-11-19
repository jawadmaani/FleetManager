using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FleetManager.Model;

public class MaintenanceLog
{
    [Key]
    public int Id { get; set; }
    
    [Required, MaxLength(100)]
    public string MaintenanceType { get; set; } = null!;
    
    [Required]
    public DateTime MaintenanceDate { get; set; }
    
    [Required, Range(0, double.MaxValue)]
    public decimal Cost { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [Required, MaxLength(100)]
    public string PerformedBy { get; set;  } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Required,ForeignKey(nameof(Vehicle))]
    public int VehicleId { get; set;  }
    public Vehicle Vehicle { get; set; } = null!;
  
    [Required,ForeignKey(nameof(User))]
    public int CreatedByUserId { get; set;  }
    public User User { get; set; } = null!;
    
}
