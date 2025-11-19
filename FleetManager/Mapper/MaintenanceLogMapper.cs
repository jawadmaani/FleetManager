using FleetManager.Dto.MaintenanceLogDto;
using FleetManager.Model;

namespace FleetManager.Mapper;

public class MaintenanceLogMapper
{
    public static MaintenanceLogResponseDto ToMaintenanceLogResponseDto(MaintenanceLog log)
    {
        return new MaintenanceLogResponseDto
        {
            Id = log.Id,
            MaintenanceType = log.MaintenanceType,
            MaintenanceDate = log.MaintenanceDate,
            Cost = log.Cost,
            Description = log.Description,
            PerformedBy = log.PerformedBy,
            VehicleId = log.VehicleId,
            CreatedByUserId = log.CreatedByUserId,
            CreatedAt = log.CreatedAt
        };
    } 
    public static List<MaintenanceLogResponseDto> ToMaintenanceLogResponseDtoList(IEnumerable<MaintenanceLog> logs)
    { 
        return logs.Select(ToMaintenanceLogResponseDto).ToList(); 
    }
    
    public static MaintenanceLog ToMaintenanceLogEntity(MaintenanceLogRequestDto dto, int userId)
    {
        return new MaintenanceLog
        {
            MaintenanceType = dto.MaintenanceType,
            MaintenanceDate = dto.MaintenanceDate,
            Cost = dto.Cost,
            Description = dto.Description,
            PerformedBy = dto.PerformedBy,
            VehicleId = dto.VehicleId,
            CreatedByUserId = userId
        };
    }
    
    
}