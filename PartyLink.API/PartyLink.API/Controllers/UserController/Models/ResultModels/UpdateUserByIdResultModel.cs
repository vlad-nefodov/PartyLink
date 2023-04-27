using PartyLink.Domain.Entities.Enums;

namespace PartyLink.API.Controllers.UserController.Models.ResultModels;

public class UpdateUserByIdResultModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public Gender Gender { get; set; }
}