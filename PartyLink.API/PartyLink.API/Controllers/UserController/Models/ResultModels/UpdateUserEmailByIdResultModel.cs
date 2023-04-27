namespace PartyLink.API.Controllers.UserController.Models.ResultModels;

public class UpdateUserEmailByIdResultModel
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
}