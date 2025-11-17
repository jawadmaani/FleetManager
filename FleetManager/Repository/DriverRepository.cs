using FleetManager.Data;
using FleetManager.Model;
using FleetManager.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FleetManager.Repository;

public class DriverRepository:IDriverRepository
{
    private  readonly AppDbContext _context;
    
    public DriverRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Driver>> GetAllAsync()
    {
        return await _context.Drivers.Include(d=>d.Vehicle).ToListAsync();
        
    }

    public async Task<Driver?> GetByIdAsync(int id)
    {
        return await _context.Drivers.Include(d=>d.Vehicle).FirstOrDefaultAsync(d => d.Id == id);
    }


    public async Task<bool> LicenseNumberExistsAsync(string license, int? excludeId = null)
    {
        return await _context.Drivers.AnyAsync(d => d.LicenseNumber == license && (excludeId == null || d.Id != excludeId));
        
    }

    public async Task<bool> PhoneNumberExistsAsync(string phone, int? excludeId = null)
    {
        return await _context.Drivers.AnyAsync(d => d.PhoneNumber == phone && (excludeId == null || d.Id != excludeId));
    }

    public async Task AddAsync(Driver entity)
    {
        await _context.Drivers.AddAsync(entity);
        
    }

    public void Update(Driver entity)
    {
        _context.Drivers.Update(entity);
    }

    public void Delete(Driver entity)
    {
        _context.Drivers.Remove(entity);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
        
    }

 
}