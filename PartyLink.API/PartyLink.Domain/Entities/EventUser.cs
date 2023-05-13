using PartyLink.Domain.Entities.Enums;

namespace PartyLink.Domain.Entities;

public class EventUser
{
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public EventUserRole EventUserRole { get; set; }
}