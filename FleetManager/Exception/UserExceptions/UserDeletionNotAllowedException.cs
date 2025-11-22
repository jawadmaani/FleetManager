namespace FleetManager.Exception.UserExceptions;

public class UserDeletionNotAllowedException:System.Exception
{
    public UserDeletionNotAllowedException(string message) : base(message)
    {
        
    }
    
}