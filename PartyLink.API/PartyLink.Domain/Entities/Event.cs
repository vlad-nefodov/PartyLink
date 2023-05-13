using PartyLink.Domain.Entities.Base;

namespace PartyLink.Domain.Entities;

public class Event : EntityBase
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }

    public EventLocation? Location { get; set; }
    public ICollection<EventTag> Tags { get; set; } = new List<EventTag>();
    public ICollection<EventUser> Users { get; set; } = new List<EventUser>();
}