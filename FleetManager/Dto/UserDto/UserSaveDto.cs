using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using FleetManager.Model.Enums;

public class UserSaveDto
{
    [Required]
    [MaxLength(50)]
    [RegularExpression(@"^[a-zA-Z0-9._-]{3,}$",
        ErrorMessage = "Username must be at least 3 characters and contain only letters, numbers, dots, underscores, or dashes.")]
    public string Username { get; set; } = null!;

    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    public string Password { get; set; } = null!;

    [Required]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public UserRole Role { get; set; }
}