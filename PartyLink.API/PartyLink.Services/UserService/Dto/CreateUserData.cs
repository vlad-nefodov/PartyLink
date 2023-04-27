using PartyLink.Domain.Entities.Enums;

namespace PartyLink.Services.UserService.Dto;

public class CreateUserData
{
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public Gender Gender { get; set; }
    public string Email { get; set; } = null!;
    public string MobilePhone { get; set; } = null!;
    public string Password { get; set; } = null!;
}