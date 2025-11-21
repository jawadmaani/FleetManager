using FleetManager.Repository.QueryResults;
using FleetManager.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace FleetManager.Controller;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class MaintenanceReportController:ControllerBase
{

    private readonly IMaintenanceReportService _maintenanceReportService;

    public MaintenanceReportController(IMaintenanceReportService maintenanceReportService)
    {
        _maintenanceReportService = maintenanceReportService;
    }
    
    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet("vehicle/{vehicleId:int}/monthly-cost")]
    public async Task<ActionResult<List<MonthlyVehicleCostResult>>> GetMonthlyCostByVehicleIdAsync(int vehicleId)
    {
        var monthlyCost  = await _maintenanceReportService.GetMonthlyCostByVehicleIdAsync(vehicleId);
        return Ok(monthlyCost);
    }

    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet("top-vehicles")]
    public async Task<ActionResult<List<VehicleTotalCostResult>>> GetTopVehiclesByMaintenanceCostAsync([FromQuery] int top = 3)
    {
        var topVehicles  = await _maintenanceReportService.GetTopVehiclesByMaintenanceCostAsync(top);
        return Ok(topVehicles);
    }

    [Authorize(Roles = "Admin,Mechanic,Viewer")]
    [HttpGet("monthly-total")]
    public async Task<ActionResult<List<MonthlyTotalCostResult>>> GetMonthlyTotalMaintenanceCostAsync()
    {
        var monthlyTotals  = await _maintenanceReportService.GetMonthlyTotalMaintenanceCostAsync();
        return Ok(monthlyTotals );
    }
    
    
    
}
