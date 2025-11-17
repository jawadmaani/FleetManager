using FleetManager.Dto.DriverDto;
using FleetManager.Model.Enums;

namespace FleetManager.Service.Interfaces;

public interface IDriverService
{
    Task<IEnumerable<DriverResponseDto>> GetAllDriversAsync();
    Task<DriverResponseDto> GetDriverByIdAsync(int id);
    Task<DriverResponseDto> CreateDriverAsync(DriverRequestDto driverCreateDto);
    Task<DriverResponseDto> UpdateDriverAsync(int id, DriverRequestDto driverUpdateDto);
     
    Task<DriverResponseDto> UpdateDriverStatusAsync(int id, Status newStatus);

    public Task<DriverResponseDto> AssignVehicleAsync(int driverId, int vehicleId);
    public Task<DriverResponseDto> UnassignVehicleAsync(int driverId) ;
    Task DeleteDriverAsync(int id);
    
}