using Microsoft.IdentityModel.Tokens;

namespace PartyLink.API.Configuration.Managers.Interfaces;

public interface ITokenDescriptorManager
{
    public SecurityTokenDescriptor GetAccessTokenDescriptor();
    public SecurityTokenDescriptor GetRefreshTokenDescriptor();
    public TokenValidationParameters GetAccessTokenValidationParameters();
    public TokenValidationParameters GetRefreshTokenValidationParameters();
}