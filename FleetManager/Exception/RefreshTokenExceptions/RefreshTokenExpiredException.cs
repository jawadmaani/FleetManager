namespace FleetManager.Exception.RefreshTokenExceptions;

public class RefreshTokenExpiredException : System.Exception
{
    public RefreshTokenExpiredException(string message) : base(message)
    {
        
    }
}