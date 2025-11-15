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
    private readonly JwtSecurityTokenHandler _tokenHandler = new();
    private readonly TokenValidationParameters _validationParameters;
    private readonly string _signingAlgorithm;

    public AccessTokenService(IOptions<JwtSettings> settings)
    {
        _settings = settings.Value;
        _privateKey = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        _privateKey.ImportFromPem(File.ReadAllText(_settings.PrivateKeyPath));
        _publicKey = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        _publicKey.ImportFromPem(File.ReadAllText(_settings.PublicKeyPath));
        
        
        _signingAlgorithm = _settings.Algorithm?.ToUpperInvariant() switch
        {
            "ES256" => SecurityAlgorithms.EcdsaSha256,
            _ => throw new NotSupportedException($"Unsupported JWT signing algorithm '{_settings.Algorithm}'.")
        };

        _validationParameters = new TokenValidationParameters
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
            RequireSignedTokens = true,
            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = ClaimTypes.Role
        };
        
    }
    
    public string CreateAccessToken(int userId, string role)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Iat,
                new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64)
        };

        var credentials = new SigningCredentials(new ECDsaSecurityKey(_privateKey), _signingAlgorithm);

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(_settings.AccessTokenExpirationMinutes),
            signingCredentials: credentials
        );

        return _tokenHandler.WriteToken(token);
    }

    public ClaimsPrincipal? ValidateAccessToken(string accessToken)
    {
        try
        {
            var principal = _tokenHandler.ValidateToken(accessToken, _validationParameters, out var validatedToken);

            if (validatedToken is not JwtSecurityToken jwtToken ||
                !jwtToken.Header.Alg.Equals(_signingAlgorithm, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }
        catch
        {
            return null;
        }
    }
    
}