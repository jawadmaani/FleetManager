using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using FleetManager.Model.Enums;

namespace FleetManager.Model;

public class Vehicle
{
    [Key]
    public int Id { get; set; }
    
    [Required, MaxLength(20)]
    public string PlateNumber { get; set; } = null!;
    
    [Required, MaxLength(100)]
    public string Model { get; set; } = null!;
    
    [Required, MaxLength(100)]
    public string Manufacturer { get; set; } = null!;
    
    [Required, Range(0, long.MaxValue)]
    public long Odometer { get; set; }
    
    [Required, Range(1900, 2100)]
    public int Year { get; set; }
    
    [Required, JsonConverter(typeof(JsonStringEnumConverter))]
    public FuelType FuelType { get; set; }
    
    [Required, JsonConverter(typeof(JsonStringEnumConverter))]
    public Status Status { get; set; } = Status.Active;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Driver? Driver { get; set; }
    
    public ICollection<MaintenanceLog> MaintenanceLogs { get; set; } = new List<MaintenanceLog>();
    
}