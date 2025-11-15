using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using FleetManager.Security;
using FleetManager.Service.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace FleetManager.Service;

public class AccessTokenService:IAccessTokenService
{
    private readonly JwtSettings _settings;
    private readonly ECDsa _privateKey;
    private readonly ECDsa _publicKey;

    public AccessTokenService(IOptions<JwtSettings> settings)
    {
        _settings = settings.Value;
        _privateKey = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        _privateKey.ImportFromPem(File.ReadAllText(_settings.PrivateKeyPath));
        _publicKey = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        _publicKey.ImportFromPem(File.ReadAllText(_settings.PublicKeyPath));
    }
    
    public string CreateAccessToken(int userId, string role)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim("role", role),
            new Claim(JwtRegisteredClaimNames.Iat,
                new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64)
        };

        var credentials = new SigningCredentials(new ECDsaSecurityKey(_privateKey), SecurityAlgorithms.EcdsaSha256);

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(_settings.AccessTokenExpirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidateAccessToken(string accessToken)
    {
        
        var validationParams = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _settings.Issuer,

            ValidateAudience = true,
            ValidAudience = _settings.Audience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new ECDsaSecurityKey(_publicKey),
            
            RequireExpirationTime = true,
            RequireSignedTokens = true
        };
        try
        {
            var principal = new JwtSecurityTokenHandler()
                .ValidateToken(accessToken, validationParams, out var validatedToken);
            var jwt = (JwtSecurityToken)validatedToken;
            return principal;
            
        }
        catch 
        {
            return null;
        }
    }
    
}