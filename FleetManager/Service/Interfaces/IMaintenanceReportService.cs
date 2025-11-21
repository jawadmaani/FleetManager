using FleetManager.Repository.QueryResults;

namespace FleetManager.Service.Interfaces;

public interface IMaintenanceReportService
{
    Task<IEnumerable<MonthlyVehicleCostResult>>
        GetMonthlyCostByVehicleIdAsync(int vehicleId);

    Task<IEnumerable<VehicleTotalCostResult>>
        GetTopVehiclesByMaintenanceCostAsync(int top = 3);

    Task<IEnumerable<MonthlyTotalCostResult>>
        GetMonthlyTotalMaintenanceCostAsync();

}