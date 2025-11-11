using FleetManager.Data;
using FleetManager.Model;
using Microsoft.EntityFrameworkCore;

namespace FleetManager.Repository;

public class RefreshTokenRepository: IRefreshTokenRepository
{
    private readonly AppDbContext _context;

    public RefreshTokenRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<RefreshToken?> GetByTokenHashAsync(string refreshTokenHash)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.RefreshTokenHash == refreshTokenHash);
    }

    public async Task<RefreshToken?> GetByTokenHashForUpdateAsync(string refreshTokenHash)
    {
        return await _context.RefreshTokens
            .FromSqlRaw("SELECT * FROM \"RefreshTokens\" WHERE \"RefreshTokenHash\" = {0} FOR UPDATE", refreshTokenHash)
            .FirstOrDefaultAsync();
    }

    public async Task<RefreshToken?> GetByUserIdAsync(int userId)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.UserId == userId);
    }


    public async Task CreateAsync(RefreshToken entity)
    {
        await _context.RefreshTokens.AddAsync(entity);
    }


    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
    
}