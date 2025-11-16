using FleetManager.Dto;
using FleetManager.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FleetManager.Controller;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VehicleController: ControllerBase
{
    private readonly IVehicleService _vehicleService;
    
    public VehicleController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }
    
    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet]
    public async Task<ActionResult<List<VehicleResponseDto>>> GetAllVehiclesAsync()
    {
        var vehicles = await _vehicleService.GetAllVehiclesAsync();
        return Ok(vehicles);

    }

    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<VehicleResponseDto>> GetVehicleByIdAsync(int id)
    {
        var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
        return Ok(vehicle);
    }

    [Authorize(Roles = "Admin,Mechanic")]
    [HttpPost]
    public async Task<ActionResult<VehicleResponseDto>> CreateVehicleAsync([FromBody] VehicleRequestDto dto)
    {
        var vehicle = await _vehicleService.CreateVehicleAsync(dto);
        return Ok(vehicle);
    }

    [Authorize(Roles = "Admin,Mechanic")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<VehicleResponseDto>> UpdateVehicleAsync(int id, [FromBody] VehicleRequestDto dto)
    {
        var vehicle = await _vehicleService.UpdateVehicleAsync(id, dto);
        return Ok(vehicle);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<VehicleResponseDto>> UpdateVehicleStatusAsync(int id,[FromBody] VehicleStatusUpdateDto dto)
    {
        var vehicle = await  _vehicleService.UpdateVehicleStatusAsync(id, dto.Status);
        return Ok(vehicle);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteVehicleAsync(int id)
    {
        await _vehicleService.DeleteVehicleAsync(id);
        return NoContent();
    }
}