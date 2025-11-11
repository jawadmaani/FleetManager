namespace FleetManager.Exception.RefreshTokenExceptions;

public class RefreshTokenNotFoundException : System.Exception
{
    public RefreshTokenNotFoundException(string message) : base(message) { }
}