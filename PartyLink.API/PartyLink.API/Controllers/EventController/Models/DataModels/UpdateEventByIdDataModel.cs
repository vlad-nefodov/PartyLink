using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.EventController.Models.DataModels;

public class UpdateEventByIdDataModel
{
    [RequiredField]
    [MinFieldLength(6)]
    [MaxFieldLength(80)]
    public string Title { get; set; } = null!;

    [RequiredField(AllowEmptyStrings = true)]
    [MaxFieldLength(200)]
    public string Description { get; set; } = null!;

    [RequiredField] public DateTime StartsAt { get; set; }

    [RequiredField] public DateTime EndsAt { get; set; }

    [RequiredField] public EventLocationDataModel Location { get; set; } = null!;

    [RequiredField]
    [MaxCollectionCount(30)]
    public IEnumerable<EventTagDataModel> Tags { get; set; } = new List<EventTagDataModel>();
}