using FleetManager.Repository.Interfaces;
using FleetManager.Repository.QueryResults;
using FleetManager.Service.Interfaces;

namespace FleetManager.Service;

public class MaintenanceReportService:IMaintenanceReportService
{
    
    private readonly IMaintenanceReportRepository _maintenanceReportRepository;

    public MaintenanceReportService(IMaintenanceReportRepository maintenanceReportRepository)
    {
        _maintenanceReportRepository=maintenanceReportRepository;
    }
    
    public async Task<IEnumerable<MonthlyVehicleCostResult>> GetMonthlyCostByVehicleIdAsync(int vehicleId)
    {
        return await _maintenanceReportRepository.GetMonthlyCostByVehicleIdAsync(vehicleId);
    }

    public async Task<IEnumerable<VehicleTotalCostResult>> GetTopVehiclesByMaintenanceCostAsync(int top = 3)
    {
        return await _maintenanceReportRepository.GetTopVehiclesByMaintenanceCostAsync(3);
    }

    public async Task<IEnumerable<MonthlyTotalCostResult>> GetMonthlyTotalMaintenanceCostAsync()
    {
        return await _maintenanceReportRepository.GetMonthlyTotalMaintenanceCostAsync();
    }
}