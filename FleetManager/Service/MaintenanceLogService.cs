using System.Security.Claims;
using FleetManager.Dto.MaintenanceLogDto;
using FleetManager.Exception.MaintenanceLogExceptions;
using FleetManager.Exception.UserExceptions;
using FleetManager.Exception.VehicleExceptions;
using FleetManager.Mapper;
using FleetManager.Repository.Interfaces;
using FleetManager.Service.Interfaces;

namespace FleetManager.Service;

public class MaintenanceLogService : IMaintenanceLogService
{
    private readonly IMaintenanceLogRepository _maintenanceLogRepository;
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public MaintenanceLogService(IMaintenanceLogRepository maintenanceLogRepository,
        IVehicleRepository vehicleRepository,IHttpContextAccessor httpContextAccessor)
    {
        _maintenanceLogRepository = maintenanceLogRepository;
        _vehicleRepository = vehicleRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<IEnumerable<MaintenanceLogResponseDto>> GetAllMaintenanceLogsAsync()
    {
        var logs = await _maintenanceLogRepository.GetAllAsync();
        return MaintenanceLogMapper.ToMaintenanceLogResponseDtoList(logs);
    }


    public async Task<MaintenanceLogResponseDto> GetMaintenanceLogByIdAsync(int id)
    {
        var maintenanceLog = await _maintenanceLogRepository.GetByIdAsync(id);
        if (maintenanceLog == null)
            throw new MaintenanceLogNotFoundException($"No maintenance log found with ID {id}");

        return MaintenanceLogMapper.ToMaintenanceLogResponseDto(maintenanceLog);
    }

    public async Task<IEnumerable<MaintenanceLogResponseDto>> GetMaintenanceLogsByVehicleIdAsync(int vehicleId)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(vehicleId);
        if (vehicle == null)
            throw new VehicleNotFoundException($"No vehicle found with ID {vehicleId}");

        var logs = await _maintenanceLogRepository.GetByVehicleIdAsync(vehicleId);
        return MaintenanceLogMapper.ToMaintenanceLogResponseDtoList(logs);
    }


    public async Task<MaintenanceLogResponseDto> CreateMaintenanceLogAsync(MaintenanceLogRequestDto maintenanceLog)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(maintenanceLog.VehicleId);
        if (vehicle == null)
            throw new VehicleNotFoundException($"No vehicle found with ID {maintenanceLog.VehicleId}");
        
        var userId= _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            throw new UserNotFoundException("Invalid user.");
        
        var newMaintenanceLog = MaintenanceLogMapper.ToMaintenanceLogEntity(maintenanceLog, int.Parse(userId));
        await _maintenanceLogRepository.AddAsync(newMaintenanceLog);
        await _maintenanceLogRepository.SaveAsync();
        
        return MaintenanceLogMapper.ToMaintenanceLogResponseDto(newMaintenanceLog);

    }

    public async Task<MaintenanceLogResponseDto> UpdateMaintenanceLogAsync(int id, MaintenanceLogUpdateDto updatedMaintenanceLog)
    {
        var maintenanceLog = await _maintenanceLogRepository.GetByIdAsync(id);
        if (maintenanceLog == null)
            throw new MaintenanceLogNotFoundException($"No maintenance log found with ID {id}");
        
        maintenanceLog.MaintenanceType = updatedMaintenanceLog.MaintenanceType;
        maintenanceLog.MaintenanceDate = updatedMaintenanceLog.MaintenanceDate;
        maintenanceLog.Cost = updatedMaintenanceLog.Cost;
        maintenanceLog.Description = updatedMaintenanceLog.Description;
        maintenanceLog.PerformedBy = updatedMaintenanceLog.PerformedBy;

        _maintenanceLogRepository.Update(maintenanceLog);
        await _maintenanceLogRepository.SaveAsync();
        
        return MaintenanceLogMapper.ToMaintenanceLogResponseDto(maintenanceLog);
    }

    public async Task DeleteMaintenanceLogAsync(int id)
    {
        var maintenanceLog = await _maintenanceLogRepository.GetByIdAsync(id);
        if (maintenanceLog == null)
            throw new MaintenanceLogNotFoundException($"No maintenance log found with ID {id}");
       
        _maintenanceLogRepository.Delete(maintenanceLog);
        await _maintenanceLogRepository.SaveAsync();
        
    }
}