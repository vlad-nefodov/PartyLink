using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using PartyLink.Domain.Entities;
using PartyLink.Repositories.Interfaces;
using PartyLink.Services.Exceptions;
using PartyLink.Services.Helpers.Interfaces;
using PartyLink.Services.Services.AuthService.Dto;
using PartyLink.Services.Services.AuthService.Exceptions;
using PartyLink.Services.Services.Interfaces;

namespace PartyLink.Services.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly IHashHelper _hashHelper;
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository, IHashHelper hashHelper)
    {
        _userRepository = userRepository;
        _hashHelper = hashHelper;
    }

    public async Task LogoutAsync(string refreshToken, TokenValidationParameters refreshTokenValidationParameters,
        CancellationToken cancellationToken = default)
    {
        if (refreshToken == null) throw new ArgumentNullException(nameof(refreshToken));
        if (refreshTokenValidationParameters == null)
            throw new ArgumentNullException(nameof(refreshTokenValidationParameters));

        // Validate refresh token
        var validationResult = await IsRefreshTokenValidAsync(refreshToken, refreshTokenValidationParameters);
        if (!validationResult.IsValid) throw new InvalidRefreshTokenException(refreshToken);

        // Get user with refresh token
        var refreshTokenHash = await _hashHelper.GetHashFromAsync(refreshToken, cancellationToken);
        var user = await _userRepository.GetSingleOrDefaultAsync(u =>
            u.RefreshToken != null &&
            u.RefreshToken.Hash == refreshTokenHash, cancellationToken);
        if (user == null) throw new NotFoundUserWithSpecifiedRefreshTokenHashException(refreshToken);

        // Remove refresh token
        user.RefreshToken = null;
        await _userRepository.SaveAsync(cancellationToken);
        _userRepository.Detach(user);
    }

    public async Task<TokensResult> LoginAsync(LoginData data, SecurityTokenDescriptor accessTokenDescriptor,
        SecurityTokenDescriptor refreshTokenDescriptor, CancellationToken cancellationToken = default)
    {
        if (data == null) throw new ArgumentNullException(nameof(data));
        if (accessTokenDescriptor == null) throw new ArgumentNullException(nameof(accessTokenDescriptor));
        if (refreshTokenDescriptor == null) throw new ArgumentNullException(nameof(refreshTokenDescriptor));

        // Get user with specified login
        var user = await _userRepository.GetSingleOrDefaultAsync(u =>
            u.Email == data.Login || u.MobilePhone == data.Login, cancellationToken);
        if (user == null) throw new InvalidLoginException(data.Login);

        // Compare password hashes
        if (user.PasswordHash.ToUpper() != data.PasswordHash.ToUpper())
            throw new InvalidPasswordHashException(data.PasswordHash);

        return await CreateNewTokensAsync(user, accessTokenDescriptor, refreshTokenDescriptor, cancellationToken);
    }

    public async Task<TokensResult> RefreshAccessTokenAsync(string refreshToken,
        SecurityTokenDescriptor accessTokenDescriptor, SecurityTokenDescriptor refreshTokenDescriptor,
        TokenValidationParameters refreshTokenValidationParameters, CancellationToken cancellationToken = default)
    {
        if (refreshToken == null) throw new ArgumentNullException(nameof(refreshToken));
        if (accessTokenDescriptor == null) throw new ArgumentNullException(nameof(accessTokenDescriptor));
        if (refreshTokenDescriptor == null) throw new ArgumentNullException(nameof(refreshTokenDescriptor));
        if (refreshTokenValidationParameters == null)
            throw new ArgumentNullException(nameof(refreshTokenValidationParameters));

        // Validate refresh token
        var validationResult = await IsRefreshTokenValidAsync(refreshToken, refreshTokenValidationParameters);
        if (!validationResult.IsValid) throw new InvalidRefreshTokenException(refreshToken);

        // Get user with refresh token
        var refreshTokenHash = await _hashHelper.GetHashFromAsync(refreshToken, cancellationToken);
        var user = await _userRepository.GetSingleOrDefaultAsync(u =>
            u.RefreshToken != null &&
            u.RefreshToken.Hash == refreshTokenHash, cancellationToken);
        if (user == null) throw new NotFoundUserWithSpecifiedRefreshTokenHashException(refreshToken);

        return await CreateNewTokensAsync(user, accessTokenDescriptor, refreshTokenDescriptor, cancellationToken);
    }

    private static async Task<TokenValidationResult> IsRefreshTokenValidAsync(string refreshToken,
        TokenValidationParameters tokenValidationParameters)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        return await tokenHandler.ValidateTokenAsync(refreshToken, tokenValidationParameters);
    }

    private static IEnumerable<Claim> GetUserClaims(User user)
    {
        return new Claim[]
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Surname, user.Surname),
            new(ClaimTypes.Gender, user.Gender.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.MobilePhone, user.MobilePhone)
        };
    }

    private async Task<TokensResult> CreateNewTokensAsync(User user, SecurityTokenDescriptor accessTokenDescriptor,
        SecurityTokenDescriptor refreshTokenDescriptor, CancellationToken cancellationToken = default)
    {
        // Add user claims
        accessTokenDescriptor.Subject = new ClaimsIdentity(GetUserClaims(user));
        refreshTokenDescriptor.Subject = new ClaimsIdentity(GetUserClaims(user));

        // Create access token
        var accessTokenHandler = new JwtSecurityTokenHandler();
        var accessToken = accessTokenHandler.CreateToken(accessTokenDescriptor);
        var accessTokenAsString = accessTokenHandler.WriteToken(accessToken);

        // Create refresh token
        var refreshTokenHandler = new JwtSecurityTokenHandler();
        var refreshToken = refreshTokenHandler.CreateToken(refreshTokenDescriptor);
        var refreshTokenAsString = refreshTokenHandler.WriteToken(refreshToken);
        var refreshTokenHash = await _hashHelper.GetHashFromAsync(refreshTokenAsString, cancellationToken);

        // Reset refresh token
        user.RefreshToken = new RefreshToken
        {
            Hash = refreshTokenHash,
            IssuedAt = refreshToken.ValidFrom,
            ExpiresAt = refreshToken.ValidTo
        };
        await _userRepository.SaveAsync(cancellationToken);
        _userRepository.Detach(user);

        return new TokensResult
        {
            AccessToken = accessTokenAsString,
            RefreshToken = refreshTokenAsString
        };
    }
}