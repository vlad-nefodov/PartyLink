using PartyLink.API.Models.ResultModels;
using PartyLink.Domain.Entities.Enums;

namespace PartyLink.API.Controllers.EventController.Models.ResultModels;

public class EventUserResultModel
{
    public Guid Id { get; set; }
    public EventUserRole EventUserRole { get; set; }
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public AvatarResultModel Avatar { get; set; } = null!;
}