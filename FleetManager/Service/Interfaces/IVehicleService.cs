using FleetManager.Dto;
using FleetManager.Model;
using FleetManager.Model.Enums;

namespace FleetManager.Service.Interfaces;

public interface IVehicleService
{
    Task<IEnumerable<VehicleResponseDto>> GetAllVehiclesAsync();
    Task<VehicleResponseDto?> GetVehicleByIdAsync(int id);
    Task<VehicleResponseDto> CreateVehicleAsync(VehicleRequestDto vehicle);
    Task<VehicleResponseDto?> UpdateVehicleAsync(int id, VehicleRequestDto updatedVehicle);

    Task<VehicleResponseDto> UpdateVehicleStatusAsync(int id, Status newStatus);

    Task<bool> DeleteVehicleAsync(int id);
    
    
    
}