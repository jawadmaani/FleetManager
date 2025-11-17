using FleetManager.Dto;
using FleetManager.Exception.VehicleExceptions;
using FleetManager.Mapper;
using FleetManager.Model.Enums;
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


    public async Task<IEnumerable<VehicleResponseDto>> GetAllVehiclesAsync()
    {
        var vehicles = await _vehicleRepository.GetAllAsync();
        if (vehicles == null)
            throw new NoVehiclesFoundException("No vehicles found.");

        return VehicleMapper.ToVehicleResponseDtoList(vehicles);
    }

    public async Task<VehicleResponseDto?> GetVehicleByIdAsync(int id)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null)
            throw new VehicleNotFoundException($"No vehicle found with ID {id}");

        return VehicleMapper.ToVehicleResponseDto(vehicle);
    }

    public async Task<VehicleResponseDto> CreateVehicleAsync(VehicleRequestDto vehicle)
    {
        var existingVehicle = await _vehicleRepository.PlateNumberExistsAsync(vehicle.PlateNumber);
        if (existingVehicle)
            throw new VehicleAlreadyExistsException("Vehicle with the same license plate already exists");

        
        var newVehicle = VehicleMapper.ToVehicleEntity(vehicle);
        
        
        await _vehicleRepository.AddAsync(newVehicle);
        await _vehicleRepository.SaveAsync();
        return VehicleMapper.ToVehicleResponseDto(newVehicle);
    }

    public async Task<VehicleResponseDto?> UpdateVehicleAsync(int id, VehicleRequestDto updatedVehicle)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null)
            throw new VehicleNotFoundException($"No vehicle found with ID {id}");
        
        var duplicatePlate = await _vehicleRepository.PlateNumberExistsAsync(updatedVehicle.PlateNumber, id);
        if (duplicatePlate)
            throw new VehicleAlreadyExistsException("Vehicle with the same license plate already exists");
        
        vehicle.PlateNumber = updatedVehicle.PlateNumber;
        vehicle.Model = updatedVehicle.Model;
        vehicle.Manufacturer = updatedVehicle.Manufacturer;
        vehicle.Year = updatedVehicle.Year;
        vehicle.Odometer= updatedVehicle.Odometer;
        vehicle.FuelType= updatedVehicle.FuelType;
      
        
        _vehicleRepository.Update(vehicle);
        await _vehicleRepository.SaveAsync();
        return VehicleMapper.ToVehicleResponseDto(vehicle);
    }

    public async Task<VehicleResponseDto> UpdateVehicleStatusAsync(int id, Status newStatus)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null)
            throw new VehicleNotFoundException($"No vehicle found with ID {id}");

        if (!Enum.IsDefined(typeof(Status), newStatus))
            throw new InvalidStatusException("Invalid status value.");

        if (vehicle.Status == newStatus)
            throw new VehicleStatusUnchangedException("Vehicle already has this status.");

        vehicle.Status = newStatus;

        _vehicleRepository.Update(vehicle);
        await _vehicleRepository.SaveAsync();

        return VehicleMapper.ToVehicleResponseDto(vehicle);
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