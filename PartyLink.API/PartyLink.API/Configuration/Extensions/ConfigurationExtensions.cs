using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Configuration.Extensions;

public static class ConfigurationExtensions
{
    public static WebApplicationBuilder AddConfiguration(this WebApplicationBuilder builder)
    {
        builder.Configuration
            .ConfigureErrorMessagesManager()
            .ConfigureTokenDescriptorManager()
            .SetBasePath($"{AppContext.BaseDirectory}/Configuration")
            .AddJsonFile("appSettings.json", false, true)
            .AddJsonFile("errorMessages.json", false, true);
        return builder;
    }

    private static ConfigurationManager ConfigureErrorMessagesManager(this ConfigurationManager configuration)
    {
        return ErrorMessagesManager.Configure(configuration);
    }

    private static ConfigurationManager ConfigureTokenDescriptorManager(this ConfigurationManager configuration)
    {
        return TokenDescriptorManager.Configure(configuration);
    }

    public static string GetDbConnectionString(this IConfiguration configuration)
    {
        return configuration.GetConnectionString("PartyLinkDBConnection") ??
               throw new NullReferenceException("GetConnectionString(\"PartyLinkDBConnection\")");
    }
}