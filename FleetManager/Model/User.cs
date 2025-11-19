using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using FleetManager.Model.Enums;

namespace FleetManager.Model;

public class User
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Username { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string passwordHash { get; set; }
    
    [Required, JsonConverter(typeof(JsonStringEnumConverter))]
    public UserRole role { get; set; }=UserRole.Viewer;
    
    public DateTime CreatedAt { get; set; } =DateTime.UtcNow;

    public RefreshToken? refreshToken { get; set; }
    
    public ICollection<MaintenanceLog> MaintenanceLogs { get; set; } = new List<MaintenanceLog>();
    
}