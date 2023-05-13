using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PartyLink.API.Configuration.Managers.Interfaces;
using PartyLink.API.Controllers.AuthController.Models.DataModels;
using PartyLink.Services.Exceptions;
using PartyLink.Services.Services.AuthService.Dto;
using PartyLink.Services.Services.AuthService.Exceptions;
using PartyLink.Services.Services.Interfaces;

namespace PartyLink.API.Controllers.AuthController;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IErrorMessagesManager _errorMessagesManager;
    private readonly IMapper _mapper;
    private readonly ITokenDescriptorManager _tokenDescriptorManager;

    public AuthController(IAuthService authService, IErrorMessagesManager errorMessagesManager, IMapper mapper,
        ITokenDescriptorManager tokenDescriptorHelper)
    {
        _authService = authService;
        _tokenDescriptorManager = tokenDescriptorHelper;
        _mapper = mapper;
        _errorMessagesManager = errorMessagesManager;
    }

    /// <summary>
    ///     Get access token + refresh token
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginDataModel dataModel,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var loginData = _mapper.Map<LoginData>(dataModel);
            var loginResult = await _authService.LoginAsync(loginData,
                _tokenDescriptorManager.GetAccessTokenDescriptor(),
                _tokenDescriptorManager.GetRefreshTokenDescriptor(), cancellationToken);

            return StatusCode(StatusCodes.Status200OK, loginResult);
        }
        catch (InvalidLoginException)
        {
            ModelState.AddModelError(nameof(dataModel.Login), _errorMessagesManager.InvalidLogin());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch (InvalidPasswordHashException)
        {
            ModelState.AddModelError(nameof(dataModel.PasswordHash), _errorMessagesManager.InvalidPasswordHash());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Remove refresh token with refresh token
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAsync([FromBody] LogoutDataModel dataModel,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _authService.LogoutAsync(dataModel.RefreshToken,
                _tokenDescriptorManager.GetRefreshTokenValidationParameters(),
                cancellationToken);

            return StatusCode(StatusCodes.Status200OK);
        }
        catch (InvalidRefreshTokenException)
        {
            ModelState.AddModelError(nameof(dataModel.RefreshToken), _errorMessagesManager.InvalidRefreshToken());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch (NotFoundUserWithSpecifiedRefreshTokenHashException)
        {
            ModelState.AddModelError(nameof(dataModel.RefreshToken),
                _errorMessagesManager.NotFoundUserWithSpecifiedRefreshTokenHash());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Refresh access token with refresh token
    /// </summary>
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshTokensAsync([FromBody] RefreshTokensDataModel dataModel,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var refreshResult = await _authService.RefreshAccessTokenAsync(dataModel.RefreshToken,
                _tokenDescriptorManager.GetAccessTokenDescriptor(),
                _tokenDescriptorManager.GetRefreshTokenDescriptor(),
                _tokenDescriptorManager.GetRefreshTokenValidationParameters(), cancellationToken);

            return StatusCode(StatusCodes.Status200OK, refreshResult);
        }
        catch (InvalidRefreshTokenException)
        {
            ModelState.AddModelError(nameof(dataModel.RefreshToken), _errorMessagesManager.InvalidRefreshToken());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch (NotFoundUserWithSpecifiedRefreshTokenHashException)
        {
            ModelState.AddModelError(nameof(dataModel.RefreshToken),
                _errorMessagesManager.NotFoundUserWithSpecifiedRefreshTokenHash());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}