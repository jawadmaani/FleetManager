namespace FleetManager.Exception.RefreshTokenExceptions;

public class RefreshTokenRevokedException : System.Exception
{
    public RefreshTokenRevokedException(string message) : base(message) { }
}