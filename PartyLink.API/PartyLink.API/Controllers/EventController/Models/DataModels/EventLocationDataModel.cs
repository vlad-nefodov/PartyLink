using PartyLink.API.Models.Attributes;

namespace PartyLink.API.Controllers.EventController.Models.DataModels;

public class EventLocationDataModel
{
    [RequiredField] [LatitudeFormat] public double Latitude { get; set; }

    [RequiredField] [LongitudeFormat] public double Longitude { get; set; }
}