using FleetManager.Dto;

namespace FleetManager.Service.Interfaces;

public interface IUserService
{
    Task<List<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto> GetUserByIdAsync(int id);
    Task<UserResponseDto> RegisterAsync(UserRequestDto dto);
    Task<UserLoginResultDto> LoginAsync(UserRequestDto dto);
}