using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PartyLink.Domain;
using PartyLink.Domain.Entities.Base;
using PartyLink.Repositories.Interfaces.Base;

namespace PartyLink.Repositories.Base;

public abstract class RepositoryBase<TEntity> : IRepositoryBase<TEntity>
    where TEntity : EntityBase
{
    protected readonly PartyLinkDbContext _dbContext;

    protected RepositoryBase(PartyLinkDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public virtual IQueryable<TEntity> GetAll()
    {
        return _dbContext.Set<TEntity>().AsQueryable();
    }

    public virtual TEntity Update(TEntity entity)
    {
        return _dbContext.Set<TEntity>().Update(entity).Entity;
    }

    public virtual TEntity Remove(TEntity entity)
    {
        return _dbContext.Set<TEntity>().Remove(entity).Entity;
    }

    public virtual void Detach(TEntity entity)
    {
        _dbContext.Entry(entity).State = EntityState.Detached;
    }

    public virtual void DetachAll(IEnumerable<TEntity> entities)
    {
        foreach (var entity in entities)
            _dbContext.Entry(entity).State = EntityState.Detached;
    }

    public virtual async Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<TEntity>().FindAsync(id, cancellationToken);
    }

    public virtual async Task<TEntity?> GetSingleOrDefaultAsync(Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<TEntity>().SingleOrDefaultAsync(predicate, cancellationToken);
    }

    public virtual async Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        return (await _dbContext.Set<TEntity>().AddAsync(entity, cancellationToken)).Entity;
    }

    public virtual async Task<int> SaveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }
}