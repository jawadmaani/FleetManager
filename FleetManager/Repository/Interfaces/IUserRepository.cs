using FleetManager.Model;

namespace FleetManager.Repository;

public interface IUserRepository: IRepository<User>
{
    Task <IEnumerable<User>> GetAllUsersAsync();
    Task<User?> GetUserByUsernameAsync(string username);
}