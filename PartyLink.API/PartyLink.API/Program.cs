using PartyLink.API.Configuration.Extensions;

namespace PartyLink.API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args)
            .AddConfiguration()
            .AddServices();

        var app = builder.Build()
            .UseMiddleware();

        app.MapControllers();
        app.Run();
    }
}