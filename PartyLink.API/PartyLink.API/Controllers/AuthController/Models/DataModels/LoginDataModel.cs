using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.AuthController.Models.DataModels;

public class LoginDataModel
{
    [RequiredField]
    [MinFieldLength(5)]
    [MaxFieldLength(50)]
    [LoginFormat]
    public string Login { get; set; } = null!;

    [RequiredField] [HashFormat(64)] public string PasswordHash { get; set; } = null!;
}