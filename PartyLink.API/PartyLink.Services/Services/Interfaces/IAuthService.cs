using Microsoft.IdentityModel.Tokens;
using PartyLink.Services.Services.AuthService.Dto;

namespace PartyLink.Services.Services.Interfaces;

public interface IAuthService
{
    public Task<TokensResult> LoginAsync(LoginData data, SecurityTokenDescriptor accessTokenDescriptor,
        SecurityTokenDescriptor refreshTokenDescriptor, CancellationToken cancellationToken = default);

    public Task LogoutAsync(string refreshToken, TokenValidationParameters refreshTokenValidationParameters,
        CancellationToken cancellationToken = default);

    public Task<TokensResult> RefreshAccessTokenAsync(string refreshToken,
        SecurityTokenDescriptor accessTokenDescriptor, SecurityTokenDescriptor refreshTokenDescriptor,
        TokenValidationParameters refreshTokenValidationParameters, CancellationToken cancellationToken = default);
}