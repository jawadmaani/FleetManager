using FleetManager.Model;

namespace FleetManager.Service.Interfaces;

public interface IRefreshTokenService
{
    Task<string> CreateRefreshTokenAsync(int userId);
    Task<RefreshToken> ValidateRefreshTokenAsync(string plainRefreshToken, bool forUpdate = false);
    Task RevokeRefreshTokenAsync(string plainToken);
    Task<(string newRefreshToken, int userId)> RotateRefreshTokenAsync(string oldPlainRefreshToken);
}