using FleetManager.Exception.VehicleExceptions;
using FleetManager.Model;
using FleetManager.Repository.Interfaces;
using FleetManager.Service.Interfaces;

namespace FleetManager.Service;

public class VehicleService:IVehicleService
{
    private readonly IVehicleRepository _vehicleRepository;

    public VehicleService(IVehicleRepository vehicleRepository)
    {
        _vehicleRepository = vehicleRepository;
    }

    
    public async Task<IEnumerable<Vehicle>> GetAllVehiclesAsync()
    {
        var vehicles= await _vehicleRepository.GetAllVehiclesAsync();
        if(vehicles==null)
            throw new NoVehicleFoundException ("No vehicles found.");
        
        return vehicles;
    }

    public async Task<Vehicle?> GetVehicleByIdAsync(int id)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null)
            throw new VehicleNotFoundException($"No vehicle found with ID {id}");
        
        return vehicle;
    }

    public async Task<Vehicle> CreateVehicleAsync(Vehicle vehicle)
    {
        var existingVehicle = await _vehicleRepository.GetVehicleByLicensePlateAsync(vehicle.PlateNumber);
        if (existingVehicle != null)
            throw new VehicleAlreadyExistsException("Vehicle with the same license plate already exists");
        
        await _vehicleRepository.AddAsync(vehicle);
        await _vehicleRepository.SaveAsync();
        return vehicle;
    }

    public async Task<Vehicle?> UpdateVehicleAsync(int id, Vehicle updatedVehicle)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null)
            throw new VehicleNotFoundException($"No vehicle found with ID {id}");
        
        vehicle.PlateNumber = updatedVehicle.PlateNumber;
        vehicle.Model = updatedVehicle.Model;
        vehicle.Manufacturer = updatedVehicle.Manufacturer;
        vehicle.Year = updatedVehicle.Year;
        vehicle.Status = updatedVehicle.Status;
        vehicle.Odometer= updatedVehicle.Odometer;
        vehicle.FuelType= updatedVehicle.FuelType;
        
        _vehicleRepository.Update(vehicle);
        await _vehicleRepository.SaveAsync();
        return vehicle;
    }

    public async Task<bool> DeleteVehicleAsync(int id)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null)
            throw new VehicleNotFoundException($"No vehicle found with ID {id}");
        
        _vehicleRepository.Delete(vehicle);
        await _vehicleRepository.SaveAsync();
        return true;
    }
}