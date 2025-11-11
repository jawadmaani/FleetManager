namespace FleetManager.Exception.UserExceptions;

public class UserAlreadyExistsException:System.Exception
{
    public UserAlreadyExistsException(string message):base(message)
    {
        
    }
    
}