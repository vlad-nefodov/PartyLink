using PartyLink.API.Models.Attributes;
using PartyLink.Domain.Entities.Enums;

namespace PartyLink.API.Controllers.UserController.Models.DataModels;

public class UpdateUserDataModel
{
    [RequiredField]
    [MinFieldLength(2)]
    [MaxFieldLength(25)]
    [NameFormat]
    public string NewName { get; set; } = null!;

    [RequiredField]
    [MinFieldLength(2)]
    [MaxFieldLength(25)]
    [SurnameFormat]
    public string NewSurname { get; set; } = null!;

    [RequiredField] [GenderFormat] public Gender NewGender { get; set; }
}