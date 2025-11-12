namespace FleetManager.Dto;

public class UserLoginResultDto
{
    public int UserId { get; init; }
    public string Role { get; init; } = null!;
    public UserResponseDto User { get; init; } = null!;
}