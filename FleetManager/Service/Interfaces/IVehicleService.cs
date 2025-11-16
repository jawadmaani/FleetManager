using FleetManager.Model;

namespace FleetManager.Service.Interfaces;

public interface IVehicleService
{
    Task<IEnumerable<Vehicle>> GetAllVehiclesAsync();
    Task<Vehicle?> GetVehicleByIdAsync(int id);
    Task<Vehicle> CreateVehicleAsync(Vehicle vehicle);
    Task<Vehicle?> UpdateVehicleAsync(int id, Vehicle updatedVehicle);
    Task<bool> DeleteVehicleAsync(int id);
    
}