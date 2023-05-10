using PartyLink.Domain.Entities.Enums;

namespace PartyLink.API.Controllers.UserController.Models.ResultModels;

public class GetUserByIdResultModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public Gender Gender { get; set; }
    public string Email { get; set; } = null!;
    public string MobilePhone { get; set; } = null!;
    public AvatarResultModel Avatar { get; set; } = null!;
}