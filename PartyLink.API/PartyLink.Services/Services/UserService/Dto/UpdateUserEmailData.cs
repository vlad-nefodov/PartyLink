namespace PartyLink.Services.Services.UserService.Dto;

public class UpdateUserEmailData
{
    public string NewEmail { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
}