namespace PartyLink.Services.Services.UserService.Dto;

public class UpdateUserPasswordData
{
    public string NewPassword { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
}