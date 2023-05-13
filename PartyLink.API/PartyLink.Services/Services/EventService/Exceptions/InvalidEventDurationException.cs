namespace PartyLink.Services.Services.EventService.Exceptions;

public class InvalidEventDurationException : Exception
{
    public InvalidEventDurationException(DateTime end, DateTime minEnd) :
        base($"EndsAt {end} less than min EndsAt {minEnd}.")
    {
        EndsAt = end;
        MinEndsAt = minEnd;
    }

    public DateTime EndsAt { get; }
    public DateTime MinEndsAt { get; }
}