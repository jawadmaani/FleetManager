using FleetManager.Dto.MaintenanceLogDto;

namespace FleetManager.Service.Interfaces;

public interface IMaintenanceLogService
{
Task<IEnumerable<MaintenanceLogResponseDto>> GetAllMaintenanceLogsAsync();
    Task<MaintenanceLogResponseDto> GetMaintenanceLogByIdAsync(int id);
    Task<IEnumerable<MaintenanceLogResponseDto>> GetMaintenanceLogsByVehicleIdAsync(int vehicleId);
    Task<MaintenanceLogResponseDto> CreateMaintenanceLogAsync(MaintenanceLogRequestDto maintenanceLog);
    Task<MaintenanceLogResponseDto> UpdateMaintenanceLogAsync(int id, MaintenanceLogUpdateDto updatedMaintenanceLog);
    Task DeleteMaintenanceLogAsync(int id);

}