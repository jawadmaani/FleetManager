using FleetManager.Model.Enums;

namespace FleetManager.Dto;

public class VehicleResponseDto
{
    public int Id { get; set; }
    public string PlateNumber { get; set; } = null!;
    public string Model { get; set; } = null!;
    public string Manufacturer { get; set; } = null!;
    public int Year { get; set; }
    public long Odometer { get; set; }
    public FuelType FuelType { get; set; }
    public Status Status { get; set; }
    public DateTime CreatedAt { get; set; }

    
}