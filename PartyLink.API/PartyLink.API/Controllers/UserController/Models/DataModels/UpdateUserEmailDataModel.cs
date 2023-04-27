using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.UserController.Models.DataModels;

public class UpdateUserEmailDataModel
{
    [RequiredField]
    [MinFieldLength(5)]
    [MaxFieldLength(50)]
    [EmailFormat]
    public string NewEmail { get; set; } = null!;

    [RequiredField] [HashFormat(64)] public string PasswordHash { get; set; } = null!;
}