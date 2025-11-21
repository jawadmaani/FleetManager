using FleetManager.Data;
using FleetManager.Model;
using FleetManager.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FleetManager.Repository;

public class VehicleRepository: IVehicleRepository
{
    private readonly AppDbContext _context;
   
    public VehicleRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Vehicle>> GetAllAsync()
    {
        return await _context.Vehicles
            .AsNoTracking()
            .Include(v => v.Driver)
            .ToListAsync();
    }

     public async Task<bool> PlateNumberExistsAsync(string plateNumber, int? excludeVehicleId = null)
        {
            return await _context.Vehicles.AnyAsync(v => v.PlateNumber == plateNumber && (excludeVehicleId == null || v.Id != excludeVehicleId));
        }

        public async Task<Vehicle?> GetByIdAsync(int id)
    {
        return await _context.Vehicles
            .AsNoTracking()
            .Include(v => v.Driver)
            .FirstOrDefaultAsync(v => v.Id == id);

    }
    
    
    public async Task AddAsync(Vehicle entity)
    {
        await _context.Vehicles.AddAsync(entity);
        
    }

    public void Update(Vehicle entity)
    {
        _context.Vehicles.Update(entity);
        
    }

    public void Delete(Vehicle entity)
    {
        _context.Vehicles.Remove(entity);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
        
    }
}