using System.Text;
using Microsoft.IdentityModel.Tokens;
using PartyLink.API.Configuration.Managers.Interfaces;

namespace PartyLink.API.Configuration.Managers;

public class TokenDescriptorManager : ITokenDescriptorManager
{
    private static readonly Lazy<TokenDescriptorManager> lazy = new(() => new TokenDescriptorManager());
    private static ConfigurationManager _configuration = null!;

    private TokenDescriptorManager()
    {
    }

    public static TokenDescriptorManager Instance
    {
        get
        {
            if (_configuration == null) throw new ArgumentNullException(nameof(_configuration));
            return lazy.Value;
        }
    }

    public SecurityTokenDescriptor GetAccessTokenDescriptor()
    {
        return new SecurityTokenDescriptor
        {
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<double>("Jwt:AccessToken:Lifetime")),
            SigningCredentials =
                new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:AccessToken:Secret"]!)),
                    SecurityAlgorithms.HmacSha256Signature)
        };
    }

    public SecurityTokenDescriptor GetRefreshTokenDescriptor()
    {
        return new SecurityTokenDescriptor
        {
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<double>("Jwt:RefreshToken:Lifetime")),
            SigningCredentials =
                new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:RefreshToken:Secret"]!)),
                    SecurityAlgorithms.HmacSha256Signature)
        };
    }

    public TokenValidationParameters GetAccessTokenValidationParameters()
    {
        return new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = _configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(_configuration.GetValue<double>("Jwt:ClockSkew")),
            ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:AccessToken:Secret"]!))
        };
    }

    public TokenValidationParameters GetRefreshTokenValidationParameters()
    {
        return new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = _configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(_configuration.GetValue<double>("Jwt:ClockSkew")),
            ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:RefreshToken:Secret"]!))
        };
    }

    public static ConfigurationManager Configure(ConfigurationManager configuration)
    {
        return _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }
}