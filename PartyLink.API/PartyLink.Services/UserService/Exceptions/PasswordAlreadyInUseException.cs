namespace PartyLink.Services.UserService.Exceptions;

public class PasswordAlreadyInUseException : Exception
{
    public PasswordAlreadyInUseException(string password) : base($"Password {password} already in use.")
    {
        Password = password;
    }

    public string Password { get; }
}