namespace PartyLink.Domain.Entities;

public class Avatar
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Base64Image { get; set; } = null!;
}