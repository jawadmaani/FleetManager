using FleetManager.Dto;
using FleetManager.Exception.UserExceptions;
using FleetManager.Mapper;
using FleetManager.Model;
using FleetManager.Model.Enums;
using FleetManager.Repository;
using FleetManager.Repository.Interfaces;
using FleetManager.Security;
using FleetManager.Service.Interfaces;

namespace FleetManager.Service;

public class UserService:IUserService
{
    private readonly IUserRepository _repository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMaintenanceLogRepository _maintenanceLogRepository;
    
    public UserService(IUserRepository repository,IMaintenanceLogRepository maintenanceLogRepository ,IPasswordHasher passwordHasher)
    {
        _repository = repository;
        _maintenanceLogRepository = maintenanceLogRepository;
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
        }; 
        
    }
    
  
    public async Task<UserResponseDto> UpdateUserAsync(int id, UserUpdateDto dto)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null)
            throw new UserNotFoundException($"No user found with ID {id}");

        var existing = await _repository.GetUserByUsernameAsync(dto.Username);
        if (existing != null && existing.Id != id)
            throw new UserAlreadyExistsException("Username already exists");

        user.Username = dto.Username;
        user.passwordHash = _passwordHasher.HashPassword(dto.Password);
        user.role = dto.Role;

        _repository.Update(user);
        await _repository.SaveAsync();

        return UserMapper.ToUserResponseDto(user);
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null)
            throw new UserNotFoundException($"No user found with ID {id}");

        var hasLogs = await _maintenanceLogRepository.AnyAsyncByUserId(id);
        if (hasLogs)
            throw new UserDeletionNotAllowedException("User cannot be deleted because they have maintenance logs assigned.");

        _repository.Delete(user);
        await _repository.SaveAsync();
    }
    
    
}

