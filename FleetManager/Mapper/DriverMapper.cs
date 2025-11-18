using FleetManager.Dto.DriverDto;
using FleetManager.Model;

namespace FleetManager.Mapper;

public class DriverMapper
{
    public static DriverResponseDto ToDriverResponseDto(Driver driver)
    {
        return new DriverResponseDto
        {
            Id = driver.Id,
            Name = driver.Name,
            LicenseNumber = driver.LicenseNumber,
            PhoneNumber = driver.PhoneNumber,
            Status = driver.Status,
            VehicleId = driver.VehicleId,
            CreatedAt = driver.CreatedAt
        };
        
    }

    public static List<DriverResponseDto> ToDriverResponseDtoList(IEnumerable<Driver> drivers)
    {
        return drivers.Select(ToDriverResponseDto).ToList();
    }
    
    public static Driver ToDriverEntity(DriverRequestDto driverRequestDto)
    {
        return new Driver
        {
            Name = driverRequestDto.Name,
            LicenseNumber = driverRequestDto.LicenseNumber,
            PhoneNumber = driverRequestDto.PhoneNumber,
        };
    }
    
}