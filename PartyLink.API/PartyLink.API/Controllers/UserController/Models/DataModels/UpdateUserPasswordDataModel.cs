using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.UserController.Models.DataModels;

public class UpdateUserPasswordDataModel
{
    [RequiredField]
    [MinFieldLength(8)]
    [MaxFieldLength(30)]
    [ContainsCharacters]
    [ContainsNumbers]
    [WithoutSpaces]
    public string NewPassword { get; set; } = null!;

    [RequiredField] [HashFormat(64)] public string PasswordHash { get; set; } = null!;
}