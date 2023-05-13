namespace PartyLink.Services.Services.AuthService.Exceptions;

public class NotFoundUserWithSpecifiedRefreshTokenHashException : Exception
{
    public NotFoundUserWithSpecifiedRefreshTokenHashException(string refreshTokenHash) :
        base($"There are no users who have this refresh token hash {refreshTokenHash}.")
    {
        RefreshTokenHash = refreshTokenHash;
    }

    public string RefreshTokenHash { get; }
}