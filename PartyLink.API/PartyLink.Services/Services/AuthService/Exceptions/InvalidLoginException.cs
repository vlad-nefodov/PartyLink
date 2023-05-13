namespace PartyLink.Services.Services.AuthService.Exceptions;

public class InvalidLoginException : Exception
{
    public InvalidLoginException(string login) : base($"Invalid login {login}.")
    {
        Login = login;
    }

    public string Login { get; }
}