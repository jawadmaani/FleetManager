namespace FleetManager.Security;

public static class CookieHelper
{
    private const string RefreshTokenCookieName = "refreshToken";
    private const int RefreshTokenLifetimeInDays = 7;

    private static CookieOptions BaseOptions => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Path = "/"
    };

    public static void SetRefreshTokenCookie(HttpResponse response, string token)
    {
        var options = BaseOptions;
        options.Expires = DateTimeOffset.UtcNow.AddDays(RefreshTokenLifetimeInDays);
        response.Cookies.Append(RefreshTokenCookieName, token, options);
    }

    public static void DeleteRefreshTokenCookie(HttpResponse response)
    {
        response.Cookies.Delete(RefreshTokenCookieName, BaseOptions);
    }
}