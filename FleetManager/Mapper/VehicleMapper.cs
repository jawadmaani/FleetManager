using FleetManager.Dto;
using FleetManager.Model;
using FleetManager.Model.Enums;

namespace FleetManager.Mapper;

public class VehicleMapper
{
    public static VehicleResponseDto ToVehicleResponseDto(Vehicle vehicle)
    {
        return new VehicleResponseDto
        {
            Id = vehicle.Id,
            PlateNumber = vehicle.PlateNumber,
            Model = vehicle.Model,
            Manufacturer = vehicle.Manufacturer,
            Year = vehicle.Year,
            Odometer = vehicle.Odometer,
            FuelType = vehicle.FuelType,
            Status = vehicle.Status,
            CreatedAt = vehicle.CreatedAt
        };
    }
    public static List<VehicleResponseDto> ToVehicleResponseDtoList(IEnumerable<Vehicle> vehicles)
    {
        return vehicles.Select(ToVehicleResponseDto).ToList();
    }

    public static Vehicle ToVehicleEntity(VehicleRequestDto dto)
    {
        var newVehicle = new Vehicle
        {
            PlateNumber = dto.PlateNumber,
            Model = dto.Model,
            Manufacturer = dto.Manufacturer,
            Year = dto.Year,
            Odometer = dto.Odometer,
            FuelType = dto.FuelType
        };

        return newVehicle;

    }

    
}