using System.Security.Cryptography;
using System.Text;
using PartyLink.Services.Helpers.Interfaces;

namespace PartyLink.Services.Helpers.Sha256HashHelper;

public sealed class Sha256HashHelper : IHashHelper
{
    private SHA256? _sha256;

    public Sha256HashHelper()
    {
        _sha256 = SHA256.Create();
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }


    public async Task<string> GetHashFromAsync(string data, CancellationToken cancellationToken = default)
    {
        if (data == null) throw new ArgumentNullException(nameof(data));

        var bytes = Encoding.UTF8.GetBytes(data);
        using var stream = new MemoryStream(bytes);
        var hashedBytes = await _sha256!.ComputeHashAsync(stream, cancellationToken);

        return BitConverter.ToString(hashedBytes).Replace("-", "");
    }

    private void Dispose(bool disposing)
    {
        if (!disposing || _sha256 == null) return;

        _sha256.Dispose();
        _sha256 = null;
    }

    ~Sha256HashHelper()
    {
        Dispose(false);
    }
}