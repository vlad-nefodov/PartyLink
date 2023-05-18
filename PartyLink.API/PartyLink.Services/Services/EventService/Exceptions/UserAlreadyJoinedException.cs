namespace PartyLink.Services.Services.EventService.Exceptions;

public class UserIsAlreadyJoinedException : Exception
{
    public UserIsAlreadyJoinedException(Guid eventId, Guid userId) :
        base($"The user with id {userId} has already joined an event with id {eventId}.")
    {
        EventId = eventId;
        UserId = userId;
    }

    public Guid EventId { get; }
    public Guid UserId { get; }
}