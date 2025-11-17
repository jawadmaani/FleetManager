using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using FleetManager.Model.Enums;

namespace FleetManager.Model;

public class Driver
{
    [Key]
    public int Id { get; set; }
    
    [Required, MaxLength(100)]
    public string Name { get; set; } = null!;
    
    [Required, MaxLength(50)]
    public string LicenseNumber { get; set; } = null!;
    
    [Required, MaxLength(20)]
    public string PhoneNumber { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Required, JsonConverter(typeof(JsonStringEnumConverter))]
    public Status Status { get; set; } = Status.Active;
    
    [ForeignKey(nameof(Vehicle))]
    public int? VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    
}