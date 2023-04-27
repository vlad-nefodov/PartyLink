namespace PartyLink.Services.UserService.Dto;

public class UpdateUserMobilePhoneData
{
    public string NewMobilePhone { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
}