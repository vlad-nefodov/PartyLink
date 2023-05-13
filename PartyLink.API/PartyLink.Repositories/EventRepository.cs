using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PartyLink.Domain;
using PartyLink.Domain.Entities;
using PartyLink.Repositories.Base;
using PartyLink.Repositories.Interfaces;

namespace PartyLink.Repositories;

public class EventRepository : RepositoryBase<Event>, IEventRepository
{
    public EventRepository(PartyLinkDbContext dbContext) : base(dbContext)
    {
    }

    public override IQueryable<Event> GetAll()
    {
        return _dbContext.Set<Event>()
            .Include(e => e.Location)
            .Include(e => e.Tags)
            .Include(e => e.Users).ThenInclude(eu => eu.User).ThenInclude(u => u.Avatar)
            .AsQueryable();
    }

    public override async Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<Event>()
            .Include(e => e.Location)
            .Include(e => e.Tags)
            .Include(e => e.Users).ThenInclude(eu => eu.User).ThenInclude(u => u.Avatar)
            .SingleOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public override async Task<Event?> GetSingleOrDefaultAsync(Expression<Func<Event, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<Event>()
            .Include(e => e.Location)
            .Include(e => e.Tags)
            .Include(e => e.Users).ThenInclude(eu => eu.User).ThenInclude(u => u.Avatar)
            .SingleOrDefaultAsync(predicate, cancellationToken);
    }
}