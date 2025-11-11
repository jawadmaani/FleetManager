using Microsoft.EntityFrameworkCore.Storage;

namespace FleetManager.Repository.Interfaces;

public interface ITransactionRepository
{
    Task<IDbContextTransaction> BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}