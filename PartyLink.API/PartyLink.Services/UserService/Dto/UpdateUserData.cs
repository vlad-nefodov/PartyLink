using PartyLink.Domain.Entities.Enums;

namespace PartyLink.Services.UserService.Dto;

public class UpdateUserData
{
    public string NewName { get; set; } = null!;
    public string NewSurname { get; set; } = null!;
    public Gender NewGender { get; set; }
}