namespace FleetManager.Exception.VehicleExceptions;

public class VehicleAlreadyExistsException:System.Exception
{
    public VehicleAlreadyExistsException(string message):base(message)
    {
    }
    
}