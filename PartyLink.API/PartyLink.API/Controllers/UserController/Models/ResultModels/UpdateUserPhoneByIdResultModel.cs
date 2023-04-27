namespace PartyLink.API.Controllers.UserController.Models.ResultModels;

public class UpdateUserMobilePhoneByIdResultModel
{
    public Guid Id { get; set; }
    public string MobilePhone { get; set; } = null!;
}