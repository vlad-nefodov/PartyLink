using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.UserController.Models.DataModels;

public class UpdateUserMobilePhoneDataModel
{
    [RequiredField]
    [MinFieldLength(8)]
    [MaxFieldLength(16)]
    [MobilePhoneFormat]
    public string NewMobilePhone { get; set; } = null!;

    [RequiredField] [HashFormat(64)] public string PasswordHash { get; set; } = null!;
}