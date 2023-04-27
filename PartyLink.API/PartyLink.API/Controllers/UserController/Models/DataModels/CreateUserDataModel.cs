using PartyLink.API.Models.Attributes;
using PartyLink.Domain.Entities.Enums;

namespace PartyLink.API.Controllers.UserController.Models.DataModels;

public class CreateUserDataModel
{
    [RequiredField]
    [MinFieldLength(2)]
    [MaxFieldLength(25)]
    [NameFormat]
    public string Name { get; set; } = null!;

    [RequiredField]
    [MinFieldLength(2)]
    [MaxFieldLength(25)]
    [SurnameFormat]
    public string Surname { get; set; } = null!;

    [RequiredField] [GenderFormat] public Gender Gender { get; set; }

    [RequiredField]
    [MinFieldLength(5)]
    [MaxFieldLength(50)]
    [EmailFormat]
    public string Email { get; set; } = null!;

    [RequiredField]
    [MinFieldLength(8)]
    [MaxFieldLength(16)]
    [MobilePhoneFormat]
    public string MobilePhone { get; set; } = null!;

    [RequiredField]
    [MinFieldLength(8)]
    [MaxFieldLength(30)]
    [ContainsCharacters]
    [ContainsNumbers]
    [WithoutSpaces]
    public string Password { get; set; } = null!;
}