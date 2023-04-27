namespace PartyLink.Services.Exceptions;

public class InvalidPasswordHashException : Exception
{
    public InvalidPasswordHashException(string passwordHash) :
        base($"Password hash {passwordHash} does not match the password.")
    {
        PasswordHash = passwordHash;
    }

    public string PasswordHash { get; }
}