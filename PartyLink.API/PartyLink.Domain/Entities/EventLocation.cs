using PartyLink.Domain.Entities.Base;

namespace PartyLink.Domain.Entities;

public class EventLocation : LocationBase
{
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
}