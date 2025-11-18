namespace FleetManager.Exception.DriverExceptions;

public class VehicleAlreadyAssignedException : System.Exception
{
    public VehicleAlreadyAssignedException(string message):base(message)
    {
        
    }
    
}