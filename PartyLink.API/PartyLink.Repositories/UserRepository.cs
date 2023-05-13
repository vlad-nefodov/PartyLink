using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PartyLink.Domain;
using PartyLink.Domain.Entities;
using PartyLink.Repositories.Base;
using PartyLink.Repositories.Interfaces;

namespace PartyLink.Repositories;

public class UserRepository : RepositoryBase<User>, IUserRepository
{
    public UserRepository(PartyLinkDbContext dbContext) : base(dbContext)
    {
    }

    public override IQueryable<User> GetAll()
    {
        return _dbContext.Set<User>()
            .Include(u => u.Avatar)
            .Include(u => u.RefreshToken)
            .AsQueryable();
    }

    public override async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<User>()
            .Include(u => u.Avatar)
            .Include(u => u.RefreshToken)
            .SingleOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public override async Task<User?> GetSingleOrDefaultAsync(Expression<Func<User, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<User>()
            .Include(u => u.Avatar)
            .Include(u => u.RefreshToken)
            .SingleOrDefaultAsync(predicate, cancellationToken);
    }
}