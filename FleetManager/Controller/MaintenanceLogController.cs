using FleetManager.Dto.MaintenanceLogDto;
using FleetManager.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FleetManager.Controller;

[ApiController]
[Route("api/[controller]")]
[Produces(("application/json"))]
public class MaintenanceLogController:ControllerBase
{
    private readonly IMaintenanceLogService _maintenanceLogService;

    public MaintenanceLogController(IMaintenanceLogService maintenanceLogService)
    {
        _maintenanceLogService = maintenanceLogService;

    }

    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet]
    public async Task<ActionResult<List<MaintenanceLogResponseDto>>> GetAllMaintenanceLogsAsync()
    {
        var maintenanceLogs = await _maintenanceLogService.GetAllMaintenanceLogsAsync();
        return Ok(maintenanceLogs);
    }

    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<MaintenanceLogResponseDto>> GetMaintenanceLogByIdAsync(int id)
    {
        var maintenanceLog = await _maintenanceLogService.GetMaintenanceLogByIdAsync(id);
        return Ok(maintenanceLog);
    }

    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet("vehicle/{vehicleId:int}")]
    public async Task<ActionResult<List<MaintenanceLogResponseDto>>> GetMaintenanceLogsByVehicleIdAsync(int vehicleId)
    {
        var maintenanceLog = await _maintenanceLogService.GetMaintenanceLogsByVehicleIdAsync(vehicleId);
        return Ok(maintenanceLog);
    }

    [Authorize(Roles = "Admin,Mechanic")]
    [HttpPost]
    public async Task<ActionResult<MaintenanceLogResponseDto>> CreateMaintenanceLogAsync(
        [FromBody] MaintenanceLogRequestDto dto)
    {
        var maintenanceLog = await _maintenanceLogService.CreateMaintenanceLogAsync(dto);
        return Ok(maintenanceLog);
    }

    [Authorize(Roles = "Admin,Mechanic")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<MaintenanceLogResponseDto>> UpdateMaintenanceLogAsync(int id,[FromBody] MaintenanceLogUpdateDto dto)
    {
        var maintenanceLog = await _maintenanceLogService.UpdateMaintenanceLogAsync(id,dto);
        return Ok(maintenanceLog);
        
    }

    [Authorize(Roles = "Admin,Mechanic")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMaintenanceLogAsync(int id)
    {
        await  _maintenanceLogService.DeleteMaintenanceLogAsync(id);
        return NoContent();
    }
    


    
}