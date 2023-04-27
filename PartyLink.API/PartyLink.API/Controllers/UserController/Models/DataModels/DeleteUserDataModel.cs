using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.UserController.Models.DataModels;

public class DeleteUserDataModel
{
    [RequiredField] [HashFormat(64)] public string PasswordHash { get; set; } = null!;
}