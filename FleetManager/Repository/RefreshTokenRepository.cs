using FleetManager.Data;
using FleetManager.Model;
using FleetManager.Repository;
using Microsoft.EntityFrameworkCore;

public class RefreshTokenRepository : IRefreshTokenRepository
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

    public async Task<IEnumerable<RefreshToken>> GetAllAsync()
    {
        return await _context.RefreshTokens
            .AsNoTracking()
            .ToListAsync();
    }


    public async Task<RefreshToken?> GetByIdAsync(int id)
    {
        return await _context.RefreshTokens.FindAsync(id);
    }
    
    public async Task<RefreshToken?> GetByUserIdAsync(int userId)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.UserId == userId);
    }

    public async Task AddAsync(RefreshToken entity)
    {
        await _context.RefreshTokens.AddAsync(entity);
    }

    public void Update(RefreshToken entity)
    {
        _context.RefreshTokens.Update(entity);
    }

    public void Delete(RefreshToken entity)
    {
        _context.RefreshTokens.Remove(entity);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}