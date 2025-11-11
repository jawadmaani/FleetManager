using FleetManager.Dto;

namespace FleetManager.Service.Interfaces;

public interface IUserService
{
    Task<List<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto> GetUserByIdAsync(int id);
    Task<UserResponseDto> RegisterAsync(UserRequestDto dto);
    Task<(int userId, string role)> LoginAsync(UserRequestDto dto);
}