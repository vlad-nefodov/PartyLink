using System.Linq.Expressions;
using PartyLink.Domain.Entities.Base;

namespace PartyLink.Repositories.Interfaces.Base;

public interface IRepositoryBase<TEntity> where TEntity : EntityBase
{
    public IQueryable<TEntity> GetAll();

    public TEntity Update(TEntity entity);

    public TEntity Remove(TEntity entity);

    /// <summary>
    ///     Detaches an entity from the DataBase context can be useful after using Save or SaveAsync.
    /// </summary>
    public void Detach(object entity);

    /// <summary>
    ///     Detaches entities from the DataBase context can be useful after using Save or SaveAsync.
    /// </summary>
    public void DetachAll(IEnumerable<object> entities);

    public Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    public Task<TEntity?> GetSingleOrDefaultAsync(Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default);

    public Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    public Task<int> SaveAsync(CancellationToken cancellationToken = default);
}