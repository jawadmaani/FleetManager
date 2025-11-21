using FleetManager.Data;
using FleetManager.Repository.Interfaces;
using FleetManager.Repository.QueryResults;
using Microsoft.EntityFrameworkCore;

namespace FleetManager.Repository;

public class MaintenanceReportRepository:IMaintenanceReportRepository
{

    private readonly AppDbContext _context;

    public MaintenanceReportRepository(AppDbContext appDbContext)
    {
        _context = appDbContext;
    }
    
    
    public async Task<IEnumerable<MonthlyVehicleCostResult>>
        GetMonthlyCostByVehicleIdAsync(int vehicleId)
    {
        var query = _context.MaintenanceLogs
            .AsNoTracking()
            .Where(m => m.VehicleId == vehicleId)
            .GroupBy(m => new
            {
                Year = m.MaintenanceDate.Year,
                Month = m.MaintenanceDate.Month
            })
            .Select(g => new MonthlyVehicleCostResult
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalCost = g.Sum(x => x.Cost)
            })
            .OrderBy(r => r.Year)
            .ThenBy(r => r.Month);

        return await query.ToListAsync();
    }


    public async Task<IEnumerable<VehicleTotalCostResult>> 
        GetTopVehiclesByMaintenanceCostAsync(int top = 3)
    {
        var query = _context.MaintenanceLogs
            .AsNoTracking()
            .GroupBy(m => m.VehicleId)
            .Select(g => new
            {
                VehicleId = g.Key,
                TotalCost = g.Sum(m => m.Cost)
            })
            .OrderByDescending(x => x.TotalCost)
            .Take(top)
            .Join(
                _context.Vehicles.AsNoTracking(),
                m => m.VehicleId,
                v => v.Id,
                (m, v) => new VehicleTotalCostResult
                {
                    VehicleId = v.Id,
                    PlateNumber = v.PlateNumber,
                    TotalCost = m.TotalCost
                }
            );

        return await query.ToListAsync();
    }


    public async Task<IEnumerable<MonthlyTotalCostResult>> GetMonthlyTotalMaintenanceCostAsync()
    {
        var query = _context.MaintenanceLogs
            .AsNoTracking()
            .GroupBy(m => new
            {
                Year = m.MaintenanceDate.Year,
                Month = m.MaintenanceDate.Month
            })
            .Select(g => new MonthlyTotalCostResult
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalCost = g.Sum(x => x.Cost)
            })
            .OrderBy(r => r.Year)
            .ThenBy(r => r.Month);

        return await query.ToListAsync();
    }
}