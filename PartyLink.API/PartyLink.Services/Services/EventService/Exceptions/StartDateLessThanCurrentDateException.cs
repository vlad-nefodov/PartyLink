namespace PartyLink.Services.Services.EventService.Exceptions;

public class StartDateLessThanCurrentDateException : Exception
{
    public StartDateLessThanCurrentDateException(DateTime start, DateTime current) :
        base($"StartAt {start} less than current date {current}.")
    {
        StartsAt = start;
        Current = current;
    }

    public DateTime StartsAt { get; }
    public DateTime Current { get; }
}