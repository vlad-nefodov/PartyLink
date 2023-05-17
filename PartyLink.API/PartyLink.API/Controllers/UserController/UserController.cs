using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PartyLink.API.Configuration.Managers.Interfaces;
using PartyLink.API.Controllers.UserController.Models.DataModels;
using PartyLink.API.Controllers.UserController.Models.ResultModels;
using PartyLink.Services.Exceptions;
using PartyLink.Services.Services.EventService.Exceptions;
using PartyLink.Services.Services.Interfaces;
using PartyLink.Services.Services.UserService.Dto;
using PartyLink.Services.Services.UserService.Exceptions;

namespace PartyLink.API.Controllers.UserController;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IErrorMessagesManager _errorMessagesManager;
    private readonly IMapper _mapper;
    private readonly IUserService _userService;

    public UserController(IMapper mapper, IUserService userService, IErrorMessagesManager errorMessagesManager)
    {
        _errorMessagesManager = errorMessagesManager;
        _userService = userService;
        _mapper = mapper;
    }

    /// <summary>
    ///     Get all users ids
    /// </summary>
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default)
    {
        try
        {
            var users = await _userService.GetAllAsync(cancellationToken);
            var mappedUsers = _mapper.Map<IEnumerable<GetAllUsersResultModel>>(users);

            return StatusCode(StatusCodes.Status200OK, mappedUsers);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Get user data by user id
    /// </summary>
    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var user = await _userService.GetByIdAsync(id, cancellationToken);
            var mappedUser = _mapper.Map<GetUserByIdResultModel>(user);

            return StatusCode(StatusCodes.Status200OK, mappedUser);
        }
        catch (NotFoundUserWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundUserWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Create new user from user data
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserDataModel dataModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var createUserData = _mapper.Map<CreateUserData>(dataModel);
            var createdUser = await _userService.CreateAsync(createUserData, cancellationToken);
            var result = _mapper.Map<CreateUserResultModel>(createdUser);

            return StatusCode(StatusCodes.Status201Created, result);
        }
        catch (EmailAlreadyInUseException)
        {
            ModelState.AddModelError(nameof(dataModel.Email), _errorMessagesManager.EmailAlreadyInUse());
            return StatusCode(StatusCodes.Status409Conflict, ModelState);
        }
        catch (MobilePhoneAlreadyInUseException)
        {
            ModelState.AddModelError(nameof(dataModel.MobilePhone), _errorMessagesManager.MobilePhoneAlreadyInUse());
            return StatusCode(StatusCodes.Status409Conflict, ModelState);
        }
        catch (PasswordAlreadyInUseException)
        {
            ModelState.AddModelError(nameof(dataModel.Password), _errorMessagesManager.PasswordAlreadyInUse());
            return StatusCode(StatusCodes.Status409Conflict, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Update public user data by user id
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateByIdAsync(Guid id, [FromBody] UpdateUserDataModel dataModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var updateUserData = _mapper.Map<UpdateUserData>(dataModel);
            var updatedUser = await _userService.UpdateByIdAsync(id, updateUserData, cancellationToken);
            var result = _mapper.Map<UpdateUserByIdResultModel>(updatedUser);

            return StatusCode(StatusCodes.Status200OK, result);
        }
        catch (NotFoundUserWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundUserWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Upload user avatar by user id
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}/avatar")]
    public async Task<IActionResult> UploadAvatarByIdAsync(Guid id, [FromBody] AvatarDataModel dataModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var updatedUser = await _userService.UploadAvatarByIdAsync(id, dataModel.Base64Image, cancellationToken);
            var result = _mapper.Map<UploadUserAvatarByIdResultModel>(updatedUser);
            return StatusCode(StatusCodes.Status200OK, result);
        }
        catch (NotFoundUserWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundUserWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Update user email by user id with password validation
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}/email")]
    public async Task<IActionResult> UpdateEmailByIdAsync(Guid id, [FromBody] UpdateUserEmailDataModel dataModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var updateEmailData = _mapper.Map<UpdateUserEmailData>(dataModel);
            var updatedUser = await _userService.UpdateEmailByIdAsync(id, updateEmailData, cancellationToken);
            var result = _mapper.Map<UpdateUserEmailByIdResultModel>(updatedUser);

            return StatusCode(StatusCodes.Status200OK, result);
        }
        catch (NotFoundUserWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundUserWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch (InvalidPasswordHashException)
        {
            ModelState.AddModelError(nameof(dataModel.PasswordHash),
                _errorMessagesManager.InvalidPasswordHash());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch (EmailAlreadyInUseException)
        {
            ModelState.AddModelError(nameof(dataModel.NewEmail), _errorMessagesManager.EmailAlreadyInUse());
            return StatusCode(StatusCodes.Status409Conflict, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Update user mobilePhone number by user id with password validation
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}/mobilePhone")]
    public async Task<IActionResult> UpdatePhoneByIdAsync(Guid id,
        [FromBody] UpdateUserMobilePhoneDataModel dataModel, CancellationToken cancellationToken)
    {
        try
        {
            var updatePhoneData = _mapper.Map<UpdateUserMobilePhoneData>(dataModel);
            var updatedUser =
                await _userService.UpdateMobilePhoneByIdAsync(id, updatePhoneData, cancellationToken);
            var result = _mapper.Map<UpdateUserMobilePhoneByIdResultModel>(updatedUser);

            return StatusCode(StatusCodes.Status200OK, result);
        }
        catch (NotFoundUserWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundUserWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch (InvalidPasswordHashException)
        {
            ModelState.AddModelError(nameof(dataModel.PasswordHash),
                _errorMessagesManager.InvalidPasswordHash());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch (MobilePhoneAlreadyInUseException)
        {
            ModelState.AddModelError(nameof(dataModel.NewMobilePhone), _errorMessagesManager.MobilePhoneAlreadyInUse());
            return StatusCode(StatusCodes.Status409Conflict, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Update user password by user id with password validation
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}/password")]
    public async Task<IActionResult> UpdatePasswordByIdAsync(Guid id, [FromBody] UpdateUserPasswordDataModel dataModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var updatePasswordData = _mapper.Map<UpdateUserPasswordData>(dataModel);
            var updatedUser = await _userService.UpdatePasswordByIdAsync(id, updatePasswordData, cancellationToken);
            var result = _mapper.Map<UpdateUserPasswordByIdResultModel>(updatedUser);

            return StatusCode(StatusCodes.Status200OK, result);
        }
        catch (NotFoundUserWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundUserWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch (InvalidPasswordHashException)
        {
            ModelState.AddModelError(nameof(dataModel.PasswordHash),
                _errorMessagesManager.InvalidPasswordHash());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch (PasswordAlreadyInUseException)
        {
            ModelState.AddModelError(nameof(dataModel.NewPassword), _errorMessagesManager.PasswordAlreadyInUse());
            return StatusCode(StatusCodes.Status409Conflict, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Delete user by user id with password validation
    /// </summary>
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteByIdAsync(Guid id, DeleteUserDataModel dataModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var deleteUserData = _mapper.Map<DeleteUserData>(dataModel);
            var deletedUser = await _userService.DeleteByIdAsync(id, deleteUserData, cancellationToken);
            var result = _mapper.Map<DeleteUserByIdResultModel>(deletedUser);

            return StatusCode(StatusCodes.Status200OK, result);
        }
        catch (NotFoundUserWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundUserWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch (InvalidPasswordHashException)
        {
            ModelState.AddModelError(nameof(dataModel.PasswordHash),
                _errorMessagesManager.InvalidPasswordHash());
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}