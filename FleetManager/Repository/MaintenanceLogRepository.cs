using FleetManager.Data;
using FleetManager.Model;
using FleetManager.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FleetManager.Repository;

public class MaintenanceLogRepository:IMaintenanceLogRepository
{
    private readonly AppDbContext _context;
    
    public MaintenanceLogRepository (AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<MaintenanceLog>> GetAllAsync()
    {
        return await _context.MaintenanceLogs
            .Include(m => m.Vehicle)
            .Include(m=>m.User)
            .ToListAsync();
    }
    
    
    public async Task<IEnumerable<MaintenanceLog>> GetByVehicleIdAsync(int vehicleId)
    {
        return await _context.MaintenanceLogs
            .Include(m => m.Vehicle)
            .Include(m=>m.User)
            .Where(m=>m.VehicleId == vehicleId)
            .ToListAsync();
    }
    
    public async Task<MaintenanceLog?> GetByIdAsync(int id)
    {
        return await _context.MaintenanceLogs
            .Include(m => m.Vehicle)
            .Include(m=>m.User)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task AddAsync(MaintenanceLog entity)
    {
        await _context.MaintenanceLogs.AddAsync(entity);

    }

    public void Update(MaintenanceLog entity)
    {
        _context.MaintenanceLogs.Update(entity);
    }

    public void Delete(MaintenanceLog entity)
    {
        _context.MaintenanceLogs.Remove(entity);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}