using PartyLink.Domain.Entities.Base;
using PartyLink.Domain.Entities.Enums;

namespace PartyLink.Domain.Entities;

public class User : EntityBase
{
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public Gender Gender { get; set; }
    public string Email { get; set; } = null!;
    public string MobilePhone { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public Avatar? Avatar { get; set; }
    public RefreshToken? RefreshToken { get; set; }
}