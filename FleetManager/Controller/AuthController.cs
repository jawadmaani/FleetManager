using FleetManager.Dto;
using FleetManager.Security;
using FleetManager.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace FleetManager.Controller;

[ApiController]
[EnableRateLimiting("auth-limit")]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IRefreshTokenService _refreshTokenService;


    public AuthController(IRefreshTokenService refreshTokenService,IUserService userService)
    
    {
        _refreshTokenService = refreshTokenService;
        _userService = userService;
       

    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> RegisterAsync([FromBody] UserRequestDto userRequestDto)
    {
        var user = await _userService.RegisterAsync(userRequestDto);
        return Ok(new AuthResponseDto { Message =$"{user.Username} register successfully"   });
    }
    
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> LoginAsync([FromBody] UserRequestDto userRequestDto)
    {
        var user = await _userService.LoginAsync(userRequestDto);
        //var accessToken = _accessTokenService.CreateAccessToken(user.UserId, user.Role);
        var refreshToken = await _refreshTokenService.CreateRefreshTokenAsync(user.UserId);
        CookieHelper.SetRefreshTokenCookie(Response, refreshToken);

        return Ok(new AuthResponseDto
        {
            Message = "Login successful.",
            User = user.User 
            //AccessToken = newAccessToken,
            // ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60
        }); 
    }

    [HttpPost("logout")]
    public async Task<ActionResult<AuthResponseDto>> LogoutAsync()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(refreshToken))
            await _refreshTokenService.RevokeRefreshTokenAsync(refreshToken);

        CookieHelper.DeleteRefreshTokenCookie(Response);
        return Ok(new AuthResponseDto { Message = "Logged out successfully" });
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> RefreshAsync()
    {
        var oldToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(oldToken))
            return Unauthorized(new AuthResponseDto { Message = "Refresh token is missing" });

        var (newRefreshToken, userId) = await _refreshTokenService.RotateRefreshTokenAsync(oldToken);
        var user = await _userService.GetUserByIdAsync(userId);
       // var newAccessToken = _accessTokenService.CreateAccessToken(user.Id,user.Role);

        CookieHelper.SetRefreshTokenCookie(Response, newRefreshToken);
        return Ok(new AuthResponseDto {
            Message = "Token refreshed successfully",
            //AccessToken = newAccessToken,
           // ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60
        });
        
    }
    
    
}