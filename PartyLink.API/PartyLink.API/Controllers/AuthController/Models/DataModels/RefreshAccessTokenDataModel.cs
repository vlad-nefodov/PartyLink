using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.AuthController.Models.DataModels;

public class RefreshAccessTokenDataModel
{
    [RequiredField] public string RefreshToken { get; set; } = null!;
}