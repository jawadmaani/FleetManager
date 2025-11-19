using FleetManager.Model;

namespace FleetManager.Repository.Interfaces;

public interface IMaintenanceLogRepository:IRepository<MaintenanceLog>
{
        Task<IEnumerable<MaintenanceLog>> GetByVehicleIdAsync(int vehicleId);

    
}