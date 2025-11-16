namespace FleetManager.Exception.VehicleExceptions;

public class VehicleNotFoundException: System.Exception
{
    public VehicleNotFoundException(string message) : base(message)
    {
    }
    
}