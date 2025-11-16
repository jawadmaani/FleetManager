using System.ComponentModel.DataAnnotations;
using FleetManager.Model.Enums;

namespace FleetManager.Dto;

public class VehicleRequestDto
{
    [Required, MaxLength(20)]
    public string PlateNumber { get; set; } = null!;

    [Required, MaxLength(100)]
    public string Model { get; set; } = null!;

    [Required, MaxLength(100)]
    public string Manufacturer { get; set; } = null!;

    [Required, Range(1900, 2100)]
    public int Year { get; set; }

    [Required, Range(0, long.MaxValue)]
    public long Odometer { get; set; }

    [Required, EnumDataType(typeof(FuelType))]
    public FuelType FuelType { get; set; }
}