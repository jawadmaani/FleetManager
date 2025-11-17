using FleetManager.Model;

namespace FleetManager.Repository;

public interface IUserRepository: IRepository<User>
{
    Task<User?> GetUserByUsernameAsync(string username);
}