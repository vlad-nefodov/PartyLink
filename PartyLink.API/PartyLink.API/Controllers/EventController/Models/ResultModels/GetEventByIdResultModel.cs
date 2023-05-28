namespace PartyLink.API.Controllers.EventController.Models.ResultModels;

public class GetEventByIdResultModel
{
    public Guid Id { get; set; }
    public EventUserResultModel OwnerUser { get; set; } = null!;
    public IEnumerable<EventUserResultModel> Participants { get; set; } = new List<EventUserResultModel>();

    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }

    public EventLocationResultModel Location { get; set; } = null!;
    public IEnumerable<EventTagResultModel> Tags { get; set; } = new List<EventTagResultModel>();
}