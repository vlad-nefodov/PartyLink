namespace PartyLink.Domain.Entities;

public class RefreshToken
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Hash { get; set; } = null!;
    public DateTime IssuedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}