namespace PartyLink.Services.Services.EventService.Dto;

public class CreateEventData
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
    public EventLocationData Location { get; set; } = null!;
    public IEnumerable<EventTagData> Tags { get; set; } = new List<EventTagData>();
}