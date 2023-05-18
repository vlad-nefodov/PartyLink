namespace PartyLink.Services.Services.EventService.Exceptions;

public class UserIsNotJoinedException : Exception
{
    public UserIsNotJoinedException(Guid eventId, Guid userId) :
        base($"The user with id {userId} has not yet joined an event with id {eventId}.")
    {
        EventId = eventId;
        UserId = userId;
    }

    public Guid EventId { get; }
    public Guid UserId { get; }
}