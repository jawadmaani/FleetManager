using FleetManager.Data;
using FleetManager.Model;
using Microsoft.EntityFrameworkCore;

namespace FleetManager.Repository;

public class UserRepository: IUserRepository


{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id); 
    }
    
    public async Task CreateAsync(User entity)
    {
       await _context.Users.AddAsync(entity);
        
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
        
    }
}