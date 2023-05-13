namespace PartyLink.API.Controllers.EventController.Models.ResultModels;

public class GetAllEventsResultModel
{
    public Guid Id { get; set; }
    public EventUserResultModel? OwnerUser { get; set; }
    public int ParticipantsCount { get; set; }

    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }

    public EventLocationResultModel Location { get; set; } = null!;
    public IEnumerable<EventTagResultModel> Tags { get; set; } = new List<EventTagResultModel>();
}