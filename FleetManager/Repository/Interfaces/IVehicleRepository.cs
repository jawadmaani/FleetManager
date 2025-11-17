using FleetManager.Model;

namespace FleetManager.Repository.Interfaces;

public interface IVehicleRepository:IRepository<Vehicle>
{
    Task<bool> PlateNumberExistsAsync(string plateNumber, int? excludeVehicleId = null);
}