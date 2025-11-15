using FleetManager.Exception.AccessTokenExceptions;
using FleetManager.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace FleetManager.Middleware;

public class JwtAuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public JwtAuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IAccessTokenService accessTokenService)
    {
        var endpoint = context.GetEndpoint();
        if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null)
        {
            await _next(context);
            return;
        }

        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            throw new MissingAuthorizationHeaderException("Authorization header missing.");

        }

        var token = authHeader.Substring("Bearer ".Length).Trim();
        var principal = accessTokenService.ValidateAccessToken(token);

        if (principal == null)
        {
            throw new InvalidAccessTokenException("Invalid or expired token.");

        }
        
        context.User = principal;
        await _next(context);
    }
}