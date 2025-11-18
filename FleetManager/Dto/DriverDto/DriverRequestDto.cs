using System.ComponentModel.DataAnnotations;

namespace FleetManager.Dto.DriverDto;

public class DriverRequestDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = null!;
    
    [Required, MaxLength(50)]
    public string LicenseNumber { get; set; } = null!;
    
    [Required, MaxLength(20)]
    public string PhoneNumber { get; set; } = null!;
    
}