using PartyLink.Domain.Entities.Base;

namespace PartyLink.Domain.Entities;

public class EventTag : EntityBase
{
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
    public string Title { get; set; } = null!;
}