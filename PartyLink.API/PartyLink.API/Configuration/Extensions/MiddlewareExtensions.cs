namespace PartyLink.API.Configuration.Extensions;

public static class MiddlewareExtensions
{
    public static WebApplication UseMiddleware(this WebApplication app)
    {
        app.UseSwagger()
            .UseSwaggerUIConfig()
            .UseCors(b =>
            {
                b.AllowAnyOrigin();
                b.AllowAnyHeader();
            })
            .UseAuthentication()
            .UseAuthorization();
        return app;
    }

    private static IApplicationBuilder UseSwaggerUIConfig(this IApplicationBuilder app)
    {
        return app.UseSwaggerUI(cfg =>
        {
            cfg.RoutePrefix = string.Empty;
            cfg.DocumentTitle = "Documentation";
            cfg.SwaggerEndpoint("swagger/v1/swagger.json", "PartyLink.API");
        });
    }
}