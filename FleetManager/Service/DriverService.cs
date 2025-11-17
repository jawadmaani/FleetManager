using FleetManager.Dto.DriverDto;
using FleetManager.Exception.DriverExceptions;
using FleetManager.Exception.VehicleExceptions;
using FleetManager.Mapper;
using FleetManager.Model.Enums;
using FleetManager.Repository.Interfaces;
using FleetManager.Service.Interfaces;

namespace FleetManager.Service;

public class DriverService: IDriverService
{
    private readonly IDriverRepository _driverRepository;
    private readonly IVehicleRepository _vehicleRepository;
    
    public DriverService(IDriverRepository driverRepository, IVehicleRepository vehicleRepository)
    {
        _driverRepository = driverRepository;
        _vehicleRepository = vehicleRepository;
    }
   
    
    public async Task<IEnumerable<DriverResponseDto>> GetAllDriversAsync()
    {
     var drivers = await  _driverRepository.GetAllAsync();
     if (drivers == null)
         throw new NoDriversFoundException ("No drivers found");
     
     return DriverMapper.ToDriverResponseDtoList(drivers);
     
    }

    public async Task<DriverResponseDto> GetDriverByIdAsync(int id)
    {
        var driver =  await _driverRepository.GetByIdAsync(id);
        if (driver == null)
            throw new DriverNotFoundException($"No driver found with ID {id}");
        
        return DriverMapper.ToDriverResponseDto(driver);
    }

    public async Task<DriverResponseDto> CreateDriverAsync(DriverRequestDto driverCreateDto)
    {
        var existingDriver= await _driverRepository.LicenseNumberExistsAsync(driverCreateDto.LicenseNumber);
        if (existingDriver)
            throw new DriverAlreadyExistsException("Driver with the same license number already exists");
        
        existingDriver = await _driverRepository.PhoneNumberExistsAsync(driverCreateDto.PhoneNumber);
        if (existingDriver)
                throw new DriverAlreadyExistsException("Driver with the same phone number already exists");
        
        var newDriver = DriverMapper.ToDriverEntity(driverCreateDto);
        
        await _driverRepository.AddAsync(newDriver);
        await _driverRepository.SaveAsync();
        
        return DriverMapper.ToDriverResponseDto(newDriver);
        
    }

    public async Task<DriverResponseDto> UpdateDriverAsync(int id, DriverRequestDto driverUpdateDto)
    {
        var driver = await  _driverRepository.GetByIdAsync(id);
        if (driver == null)
            throw new DriverNotFoundException($"No driver found with ID {id}");
        
        var duplicateLicense = await  _driverRepository.LicenseNumberExistsAsync(driverUpdateDto.LicenseNumber, id);
        if (duplicateLicense)
            throw new DriverAlreadyExistsException("Driver with the same license number already exists");
        
        var duplicatePhone = await  _driverRepository.PhoneNumberExistsAsync(driverUpdateDto.PhoneNumber, id);
        if (duplicatePhone)
                throw new DriverAlreadyExistsException("Driver with the same phone number already exists");
        
        driver.Name = driverUpdateDto.Name;
        driver.LicenseNumber = driverUpdateDto.LicenseNumber;
        driver.PhoneNumber = driverUpdateDto.PhoneNumber;
        
        _driverRepository.Update(driver);
        await _driverRepository.SaveAsync();
        
        return DriverMapper.ToDriverResponseDto(driver);
            
    }

    public async Task<DriverResponseDto> UpdateDriverStatusAsync(int id, Status newStatus)
    {
        var driver = await  _driverRepository.GetByIdAsync(id);
        if (driver == null)
            throw new DriverNotFoundException($"No driver found with ID {id}");
        
        if (!Enum.IsDefined(typeof(Status), newStatus))
            throw new InvalidStatusException("Invalid status value.");
        
        if (driver.Status == newStatus)
            throw new DriverStatusUnchangedException("Driver already has this status.");
        
        driver.Status = newStatus;
        
        _driverRepository.Update(driver);
        await _driverRepository.SaveAsync();
        
        return DriverMapper.ToDriverResponseDto(driver);
    }

    public async Task<DriverResponseDto> AssignVehicleAsync(int driverId, int vehicleId)
    {
        var driver = await  _driverRepository.GetByIdAsync(driverId);
        if (driver == null)
            throw new DriverNotFoundException($"No driver found with ID {driverId}");
        
        var vehicle = await  _vehicleRepository.GetByIdAsync(vehicleId);
        if (vehicle == null)
            throw new VehicleNotFoundException($"No vehicle found with ID {vehicleId}");

        if (vehicle.Status != Status.Active)
            throw new InvalidOperationException("Vehicle is not active and cannot be assigned to a driver.");
        
        if (driver.VehicleId != null)
                throw new InvalidOperationException("Driver already has a vehicle assigned.");
        
        if (vehicle.Driver != null)
            throw new InvalidOperationException("Vehicle is already assigned to another driver.");
        
        driver.VehicleId= vehicleId;
        
        _driverRepository.Update(driver);
        await _driverRepository.SaveAsync();
        
        return DriverMapper.ToDriverResponseDto(driver);
    }

    public async Task<DriverResponseDto> UnassignVehicleAsync(int driverId)
    {
        var driver = await  _driverRepository.GetByIdAsync(driverId);
        if (driver == null)
            throw new DriverNotFoundException($"No driver found with ID {driverId}");
        
        if (driver.VehicleId == null)
            throw new InvalidOperationException("Driver has no vehicle assigned.");
        
        driver.VehicleId = null;
        
        _driverRepository.Update(driver);
        await _driverRepository.SaveAsync();
        
        return DriverMapper.ToDriverResponseDto(driver);
    }

    public async Task DeleteDriverAsync(int id)
    {
        var driver = await  _driverRepository.GetByIdAsync(id);
        if (driver == null)
            throw new DriverNotFoundException($"No driver found with ID {id}");
       
        if (driver.VehicleId != null)
        {
            driver.VehicleId = null;
            _driverRepository.Update(driver);
        }
        
        _driverRepository.Delete(driver);
        await _driverRepository.SaveAsync();
    }
}