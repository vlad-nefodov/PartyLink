using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.AuthController.Models.DataModels;

public class LogoutDataModel
{
    [RequiredField] public string RefreshToken { get; set; } = null!;
}