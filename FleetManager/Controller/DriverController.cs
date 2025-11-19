using FleetManager.Dto.DriverDto;
using FleetManager.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FleetManager.Controller;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DriverController: ControllerBase
{
    private readonly IDriverService _driverService;
    
    public DriverController(IDriverService driverService)
    {
        _driverService = driverService;
    }
    
    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet]
    public async Task<ActionResult<List<DriverResponseDto>>> GetAllDriversAsync()
    {
        var drivers = await _driverService.GetAllDriversAsync();
        return Ok(drivers);
    }
    
    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<DriverResponseDto>> GetDriverByIdAsync(int id)
    {
        var driver = await _driverService.GetDriverByIdAsync(id);
        return Ok(driver);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<DriverResponseDto>> CreateDriverAsync([FromBody] DriverRequestDto dto)
    {
        var driver = await _driverService.CreateDriverAsync(dto);
        return Ok(driver);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<DriverResponseDto>> UpdateDriverAsync(int id, [FromBody] DriverRequestDto dto)
    {
        var driver = await _driverService.UpdateDriverAsync(id, dto);
        return Ok(driver);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<DriverResponseDto>> UpdateDriverStatusAsync(int id,[FromBody] DriverStatusUpdateDto dto)
    {
        var driver = await  _driverService.UpdateDriverStatusAsync(id, dto.Status);
        return Ok(driver);
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{driverId:int}/assign-vehicle")]
    public async Task<ActionResult<DriverResponseDto>> AssignVehicleToDriverAsync(int driverId,[FromBody] DriverAssignVehicleDto  dto)
    {
        var driver = await _driverService.AssignVehicleAsync(driverId, dto.VehicleId);
        return Ok(driver);
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{driverId:int}/unassign-vehicle")]
    public async Task<ActionResult<DriverResponseDto>> UnassignVehicleFromDriverAsync(int driverId)
    {
        var driver = await _driverService.UnassignVehicleAsync(driverId);
        return Ok(driver);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDriverAsync(int id)
    {
        await _driverService.DeleteDriverAsync(id);
        return NoContent();
    }
}