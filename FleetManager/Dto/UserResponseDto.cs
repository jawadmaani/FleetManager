using System.Text.Json.Serialization;
using FleetManager.Model.Enums;

namespace FleetManager.Dto;

public class UserResponseDto
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public UserRole Role { get; set; }

    public DateTime CreatedAt { get; set; }
}