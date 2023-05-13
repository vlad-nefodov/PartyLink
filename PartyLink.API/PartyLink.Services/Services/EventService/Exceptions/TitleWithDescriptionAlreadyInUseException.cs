namespace PartyLink.Services.Services.EventService.Exceptions;

public class TitleWithDescriptionAlreadyInUseException : Exception
{
    public TitleWithDescriptionAlreadyInUseException(string title, string description) :
        base($"Title {title} with description {description} already in use.")
    {
        Title = title;
        Description = description;
    }

    public string Title { get; }
    public string Description { get; }
}