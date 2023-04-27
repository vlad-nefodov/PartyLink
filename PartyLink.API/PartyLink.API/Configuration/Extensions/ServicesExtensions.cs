using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using PartyLink.API.Configuration.Managers;
using PartyLink.API.Configuration.Managers.Interfaces;
using PartyLink.API.Controllers.AuthController;
using PartyLink.API.Controllers.UserController;
using PartyLink.Domain;
using PartyLink.Repositories;
using PartyLink.Repositories.Interfaces;
using PartyLink.Services.AuthService;
using PartyLink.Services.Helpers.Interfaces;
using PartyLink.Services.Helpers.Sha256HashHelper;
using PartyLink.Services.Interfaces;
using PartyLink.Services.UserService;

namespace PartyLink.API.Configuration.Extensions;

public static class ServicesExtensions
{
    public static WebApplicationBuilder AddServices(this WebApplicationBuilder builder)
    {
        builder.Services
            .AddSingleton<IErrorMessagesManager>(ErrorMessagesManager.Instance)
            .AddSingleton<ITokenDescriptorManager>(TokenDescriptorManager.Instance)
            .AddDbContext<PartyLinkDbContext>(opts => opts.UseSqlServer(builder.Configuration.GetDbConnectionString()))
            .AddScoped<IHashHelper, Sha256HashHelper>()
            .AddScoped<IUserRepository, UserRepository>()
            .AddScoped<IUserService, UserService>()
            .AddScoped<IAuthService, AuthService>()
            .AddMapper()
            .AddSwaggerGen()
            .AddJwtAuthentication(TokenDescriptorManager.Instance)
            .AddAuthorization()
            .AddControllers()
            .AddJsonOptions();
        return builder;
    }

    private static IMvcBuilder AddJsonOptions(this IMvcBuilder mvcBuilder)
    {
        return mvcBuilder.AddJsonOptions(opts =>
        {
            opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            opts.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
        });
    }

    private static IServiceCollection AddJwtAuthentication(this IServiceCollection services,
        ITokenDescriptorManager tokenDescriptorManager)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = tokenDescriptorManager.GetAccessTokenValidationParameters();
            });
        return services;
    }

    private static IServiceCollection AddMapper(this IServiceCollection services)
    {
        return services.AddAutoMapper(cfg =>
        {
            cfg.AddProfile<UserControllerMapperProfile>();
            cfg.AddProfile<AuthControllerMapperProfile>();
            cfg.AddProfile<UserServiceMapperProfile>();
        });
    }
}