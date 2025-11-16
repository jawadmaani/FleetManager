using FleetManager.Model;

namespace FleetManager.Repository.Interfaces;

public interface IVehicleRepository:IRepository<Vehicle>
{
    Task<IEnumerable<Vehicle>> GetAllVehiclesAsync();
    Task<Vehicle?> GetVehicleByLicensePlateAsync(string licensePlate);
    
}