namespace PartyLink.Services.AuthService.Dto;

public class TokensResult
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}