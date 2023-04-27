namespace PartyLink.Services.Helpers.Interfaces;

public interface IHashHelper : IDisposable
{
    public Task<string> GetHashFromAsync(string data, CancellationToken cancellationToken = default);
}