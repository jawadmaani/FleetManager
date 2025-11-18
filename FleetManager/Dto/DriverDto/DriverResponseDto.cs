using FleetManager.Model.Enums;

namespace FleetManager.Dto.DriverDto;

public class DriverResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; }= null!;
    public string LicenseNumber { get; set; }= null!;
    public string PhoneNumber { get; set; }= null!;
    public Status Status { get; set; }
    public int? VehicleId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    
    
}