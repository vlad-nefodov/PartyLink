using PartyLink.Domain.Entities.Enums;

namespace PartyLink.API.Controllers.EventController.Models.ResultModels;

public class EventUserRoleResultModel
{
    public Guid UserId { get; set; }
    public EventUserRole Role { get; set; }
}