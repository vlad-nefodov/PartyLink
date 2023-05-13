namespace PartyLink.Services.Services.AuthService.Exceptions;

public class InvalidRefreshTokenException : Exception
{
    public InvalidRefreshTokenException(string refreshToken) : base($"Invalid refresh token {refreshToken}.")
    {
        RefreshToken = refreshToken;
    }

    public string RefreshToken { get; }
}