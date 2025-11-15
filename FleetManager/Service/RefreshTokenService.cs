using System.Security.Cryptography;
using FleetManager.Exception.RefreshTokenExceptions;
using FleetManager.Exception.UserExceptions;
using FleetManager.Model;
using FleetManager.Repository;
using FleetManager.Repository.Interfaces;
using FleetManager.Security;
using FleetManager.Service.Interfaces;

namespace FleetManager.Service;

public class RefreshTokenService:IRefreshTokenService
{
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUserRepository _userRepository;
    private readonly ITransactionRepository _transactionRepository;
    private readonly TokenHasher _tokenHasher;

    public RefreshTokenService(
        IRefreshTokenRepository refreshTokenRepository,
        IUserRepository userRepository,
        ITransactionRepository transactionRepository,
        TokenHasher tokenHasher)
    {
        _refreshTokenRepository = refreshTokenRepository;
        _userRepository = userRepository;
        _transactionRepository = transactionRepository;
        _tokenHasher = tokenHasher;
    }
    public async Task<string> CreateRefreshTokenAsync(int userId)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null)
            throw new UserNotFoundException($"User with ID {userId} not found.");

        var plainToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var hashedToken = _tokenHasher.HashToken(plainToken);
        var existingToken = await _refreshTokenRepository.GetByUserIdAsync(userId);

        if (existingToken != null)
        {
            existingToken.RefreshTokenHash = hashedToken;
            existingToken.CreatedAt = DateTime.UtcNow;
            existingToken.ExpiresAt = DateTime.UtcNow.AddDays(7);
            existingToken.RevokedAt = null;
        }
        else
        {
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                RefreshTokenHash = hashedToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow
            };
            await _refreshTokenRepository.CreateAsync(refreshToken);
        }
         
        await _refreshTokenRepository.SaveAsync();
        
        return plainToken;
    }
    
    public async Task<RefreshToken> ValidateRefreshTokenAsync(string plainRefreshToken, bool forUpdate = false)
    {
        var hashed = _tokenHasher.HashToken(plainRefreshToken);

        RefreshToken? storedToken = forUpdate
            ? await _refreshTokenRepository.GetByTokenHashForUpdateAsync(hashed)
            : await _refreshTokenRepository.GetByTokenHashAsync(hashed);

        if (storedToken == null)
            throw new RefreshTokenNotFoundException("The refresh token does not exist or is invalid.");

        if (storedToken.RevokedAt.HasValue)
            throw new RefreshTokenRevokedException("The refresh token has been revoked.");

        if (storedToken.ExpiresAt < DateTime.UtcNow)
            throw new RefreshTokenExpiredException("The refresh token has expired.");

        return storedToken;
    }
    
    public async Task RevokeRefreshTokenAsync(string plainToken)
    {
        var hashed = _tokenHasher.HashToken(plainToken);
        var token = await _refreshTokenRepository.GetByTokenHashAsync(hashed);
        if (token == null) return;

        token.RevokedAt = DateTime.UtcNow;
        await _refreshTokenRepository.SaveAsync();
    }
    
    public async Task<(string newRefreshToken, int userId)> RotateRefreshTokenAsync(string oldPlainRefreshToken)
    {
        await using var transaction = await _transactionRepository.BeginTransactionAsync();

        try
        { 
            var oldRefreshToken = await ValidateRefreshTokenAsync(oldPlainRefreshToken, forUpdate: true);
        
            var newRefreshTokenPlain = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var newHashedRefreshToken = _tokenHasher.HashToken(newRefreshTokenPlain);

            oldRefreshToken.RefreshTokenHash = newHashedRefreshToken;
            oldRefreshToken.CreatedAt = DateTime.UtcNow;
            oldRefreshToken.ExpiresAt = DateTime.UtcNow.AddDays(7);
            oldRefreshToken.RevokedAt = null;

            await _refreshTokenRepository.SaveAsync();
            await _transactionRepository.CommitTransactionAsync();

            return (newRefreshTokenPlain, oldRefreshToken.UserId);
        }
        catch
        {
            await _transactionRepository.RollbackTransactionAsync();
            throw;
        }
    }


}

