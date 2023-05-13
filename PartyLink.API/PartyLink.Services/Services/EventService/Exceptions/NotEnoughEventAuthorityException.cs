using PartyLink.Domain.Entities.Enums;

namespace PartyLink.Services.Services.EventService.Exceptions;

public class NotEnoughEventAuthorityException : Exception
{
    public NotEnoughEventAuthorityException(Guid eventId, Guid userId, EventUserRole requiredRole) :
        base($"Event user role must be {requiredRole}.")
    {
        EventId = eventId;
        UserId = userId;
        RequiredRole = requiredRole;
    }

    public Guid EventId { get; }
    public Guid UserId { get; }
    public EventUserRole RequiredRole { get; }
}