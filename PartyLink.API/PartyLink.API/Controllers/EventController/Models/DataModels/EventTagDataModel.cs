using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.EventController.Models.DataModels;

public class EventTagDataModel
{
    [RequiredField] [MaxFieldLength(30)] public string Title { get; set; } = null!;
}