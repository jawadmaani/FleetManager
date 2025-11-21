using FleetManager.Repository.QueryResults;

namespace FleetManager.Repository.Interfaces;

public interface IMaintenanceReportRepository
{
    Task<IEnumerable<MonthlyVehicleCostResult>> 
        GetMonthlyCostByVehicleIdAsync(int vehicleId);

    Task<IEnumerable<VehicleTotalCostResult>> 
        GetTopVehiclesByMaintenanceCostAsync(int top = 3);

    Task<IEnumerable<MonthlyTotalCostResult>> 
        GetMonthlyTotalMaintenanceCostAsync();
}