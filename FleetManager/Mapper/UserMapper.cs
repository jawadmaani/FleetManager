using FleetManager.Dto;
using FleetManager.Model;

namespace FleetManager.Mapper;

public static class UserMapper
{
    public static UserResponseDto ToUserResponseDto(User user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Role = user.role,
            CreatedAt = user.CreatedAt
        };
    }

    public static List<UserResponseDto> ToUserResponseDtoList(IEnumerable<User> users)
    {
        return users.Select(ToUserResponseDto).ToList();
    }
}