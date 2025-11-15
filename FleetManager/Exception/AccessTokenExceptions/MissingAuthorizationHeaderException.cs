namespace FleetManager.Exception.AccessTokenExceptions;

public class MissingAuthorizationHeaderException:System.Exception
{
    public MissingAuthorizationHeaderException(string message):base(message)
    {
        
    }
    
}