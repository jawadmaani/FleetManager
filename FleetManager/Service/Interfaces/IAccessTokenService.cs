using System.Security.Claims;

namespace FleetManager.Service.Interfaces;

public interface IAccessTokenService
{
    string CreateAccessToken(int userId,string role);
    ClaimsPrincipal?  ValidateAccessToken(string accessToken);
    
}