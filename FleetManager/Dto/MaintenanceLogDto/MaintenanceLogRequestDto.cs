using System.ComponentModel.DataAnnotations;

namespace FleetManager.Dto.MaintenanceLogDto;

public class MaintenanceLogRequestDto
{
    [Required, MaxLength(100)]
    public string MaintenanceType { get; set; } = null!;
    
    [Required]
    public DateTime MaintenanceDate { get; set; }
    
    [Required, Range(0, long.MaxValue)]
    public decimal Cost { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [Required,MaxLength(100)]
    public string PerformedBy  { get; set; } = null!;
    
    [Required]
    public int VehicleId { get; set; }
    
    
}