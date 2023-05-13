namespace PartyLink.Services.Exceptions;

public class NotFoundEventWithSpecifiedIdException : Exception
{
    public NotFoundEventWithSpecifiedIdException(Guid id) : base($"The event with Id {id} does not exist.")
    {
        Id = id;
    }

    public Guid Id { get; }
}