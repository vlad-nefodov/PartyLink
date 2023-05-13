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

    public virtual void Detach(object entity)
    {
        var entry = _dbContext.Entry(entity);
        entry.State = EntityState.Detached;

        foreach (var reference in entry.References)
            if (reference.TargetEntry != null && reference.TargetEntry.State != EntityState.Detached)
                Detach(reference.TargetEntry.Entity);

        foreach (var collection in entry.Collections)
        {
            if (collection.CurrentValue == null)
                continue;
            foreach (var currentEntity in collection.CurrentValue)
                if (_dbContext.Entry(currentEntity).State != EntityState.Detached)
                    Detach(currentEntity);
        }
    }

    public virtual void DetachAll(IEnumerable<object> entities)
    {
        foreach (var entity in entities)
            Detach(entity);
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