namespace PartyLink.Services.UserService.Exceptions;

public class EmailAlreadyInUseException : Exception
{
    public EmailAlreadyInUseException(string email) : base($"Email {email} already in use.")
    {
        Email = email;
    }

    public string Email { get; }
}