namespace FleetManager.Security;

public interface ITokenHashStrategy
{
    string Hash(string token, string secretKey);

}