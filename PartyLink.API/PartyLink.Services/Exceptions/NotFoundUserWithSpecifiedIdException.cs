namespace PartyLink.Services.Exceptions;

public class NotFoundUserWithSpecifiedIdException : Exception
{
    public NotFoundUserWithSpecifiedIdException(Guid id) : base($"The user with Id {id} does not exist.")
    {
        Id = id;
    }

    public Guid Id { get; }
}