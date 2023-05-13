namespace PartyLink.Services.Services.AuthService.Dto;

public class LoginData
{
    public string Login { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
}