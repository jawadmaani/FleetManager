using FleetManager.Model;

namespace FleetManager.Repository;

public interface IRefreshTokenRepository: IRepository<RefreshToken>
{
    Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);
    Task<RefreshToken?> GetByTokenHashForUpdateAsync(string tokenHash);
}