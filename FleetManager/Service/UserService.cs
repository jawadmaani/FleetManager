using FleetManager.Dto;
using FleetManager.Exception.UserExceptions;
using FleetManager.Mapper;
using FleetManager.Model;
using FleetManager.Model.Enums;
using FleetManager.Repository;
using FleetManager.Security;
using FleetManager.Service.Interfaces;

namespace FleetManager.Service;

public class UserService:IUserService
{
    private readonly IUserRepository _repository;
    private readonly IPasswordHasher _passwordHasher;
    
    public UserService(IUserRepository repository, IPasswordHasher passwordHasher)
    {
        _repository = repository;
        _passwordHasher = passwordHasher;
    }

    public async Task<List<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _repository.GetAllAsync();
        if (users == null || !users.Any())
            throw new NoUsersFoundException("No users found.");

        return UserMapper.ToUserResponseDtoList(users);
    }

    public async Task<UserResponseDto> GetUserByIdAsync(int id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null)
            throw new UserNotFoundException($"No user found with ID {id}");

        return UserMapper.ToUserResponseDto(user);
    }

    public async Task<UserResponseDto> RegisterAsync(UserRequestDto dto)
    {
        var existingUser = await _repository.GetUserByUsernameAsync(dto.Username);
        if (existingUser != null)
            throw new UserAlreadyExistsException("Username already exists");

        var user = new User
        {
            Username = dto.Username,
            passwordHash = _passwordHasher.HashPassword(dto.Password),
            role = UserRole.Viewer
        };

        await _repository.AddAsync(user);
        await _repository.SaveAsync();

        return UserMapper.ToUserResponseDto(user);
    }

    public async Task<UserLoginResultDto> LoginAsync(UserRequestDto dto)
    {
        var user = await _repository.GetUserByUsernameAsync(dto.Username);
        if (user == null)
            throw new InvalidCredentialsException("Invalid username or password");

        var valid = _passwordHasher.VerifyPassword(user.passwordHash, dto.Password);
        if (!valid)
            throw new InvalidCredentialsException("Invalid username or password");

        return new UserLoginResultDto
        {
            UserId = user.Id,
            Role = user.role.ToString(),
            User = UserMapper.ToUserResponseDto(user)
        };    }
}
