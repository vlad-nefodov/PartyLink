using PartyLink.Domain.Entities;
using PartyLink.Services.Services.EventService.Dto;

namespace PartyLink.Services.Services.Interfaces;

public interface IEventService
{
    public Task<IEnumerable<Event>> GetAllAsync(CancellationToken cancellationToken = default);

    public Task<Event> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    public Task<Event> CreateWithOwnerIdAsync(Guid ownerId, CreateEventData data,
        CancellationToken cancellationToken = default);

    public Task<Event> UpdateByIdWithOwnerIdAsync(Guid id, Guid ownerId, UpdateEventData data,
        CancellationToken cancellationToken = default);

    public Task<Event> DeleteByIdWithOwnerIdAsync(Guid id, Guid ownerId, CancellationToken cancellationToken = default);
    public Task JoinEventAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
    public Task LeaveEventAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default);
}