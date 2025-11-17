using FleetManager.Model;

namespace FleetManager.Repository.Interfaces;

public interface IDriverRepository:IRepository<Driver>
{
    Task<bool> LicenseNumberExistsAsync(string license, int? excludeId = null);
    Task<bool> PhoneNumberExistsAsync(string phone, int? excludeId = null);
    
}