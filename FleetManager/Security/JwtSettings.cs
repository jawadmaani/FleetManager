namespace FleetManager.Security;

public class JwtSettings
{
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int AccessTokenExpirationMinutes { get; set; } = 15;
    public string PrivateKeyPath { get; set; } = string.Empty;
    public string PublicKeyPath { get; set; } = string.Empty;
    public string Algorithm { get; set; } = "ES256";
}