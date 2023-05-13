using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PartyLink.API.Configuration.Managers.Interfaces;
using PartyLink.API.Controllers.EventController.Models.DataModels;
using PartyLink.API.Controllers.EventController.Models.ResultModels;
using PartyLink.Services.Exceptions;
using PartyLink.Services.Services.EventService.Dto;
using PartyLink.Services.Services.EventService.Exceptions;
using PartyLink.Services.Services.Interfaces;

namespace PartyLink.API.Controllers.EventController;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private const int _minEventMinutesDuration = 30;
    private readonly IErrorMessagesManager _errorMessagesManager;
    private readonly IEventService _eventService;
    private readonly IMapper _mapper;

    public EventController(IMapper mapper, IEventService eventService, IErrorMessagesManager errorMessagesManager)
    {
        _errorMessagesManager = errorMessagesManager;
        _eventService = eventService;
        _mapper = mapper;
    }

    /// <summary>
    ///     Get all events
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default)
    {
        try
        {
            var eventEntities = await _eventService.GetAllAsync(cancellationToken);
            var mappedEventEntities = _mapper.Map<IEnumerable<GetAllEventsResultModel>>(eventEntities);

            return StatusCode(StatusCodes.Status200OK, mappedEventEntities);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Get event data by event id
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var eventEntity = await _eventService.GetByIdAsync(id, cancellationToken);
            var mappedEventEntity = _mapper.Map<GetEventByIdResultModel>(eventEntity);

            return StatusCode(StatusCodes.Status200OK, mappedEventEntity);
        }
        catch (NotFoundEventWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundEventWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Create new event from event data
    /// </summary>
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateEventDataModel dataModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var ownerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var createEventData = _mapper.Map<CreateEventData>(dataModel);
            var createdUser = await _eventService.CreateWithOwnerIdAsync(ownerId, createEventData, cancellationToken);
            var result = _mapper.Map<CreateEventResultModel>(createdUser);

            return StatusCode(StatusCodes.Status201Created, result);
        }
        catch (NotFoundUserWithSpecifiedIdException)
        {
            ModelState.AddModelError("ownerId", _errorMessagesManager.NotFoundUserWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch (TitleWithDescriptionAlreadyInUseException)
        {
            ModelState.AddModelError($"{nameof(dataModel.Title)} and {nameof(dataModel.Description)}",
                _errorMessagesManager.TitleWithDescriptionAlreadyInUse());
            return StatusCode(StatusCodes.Status409Conflict, ModelState);
        }
        catch (StartDateLessThanCurrentDateException)
        {
            ModelState.AddModelError(nameof(dataModel.StartsAt), _errorMessagesManager.StartDateLessThanCurrentDate());
            return StatusCode(StatusCodes.Status400BadRequest, ModelState);
        }
        catch (InvalidEventDurationException)
        {
            ModelState.AddModelError($"{nameof(dataModel.StartsAt)} and {nameof(dataModel.EndsAt)}",
                _errorMessagesManager.InvalidEventDuration(_minEventMinutesDuration));
            return StatusCode(StatusCodes.Status400BadRequest, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Update event data by event id
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateByIdAsync(Guid id, [FromBody] UpdateEventByIdDataModel dataModel,
        CancellationToken cancellationToken)
    {
        try
        {
            var ownerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var updateEventData = _mapper.Map<UpdateEventData>(dataModel);
            var updatedEventEntity =
                await _eventService.UpdateByIdWithOwnerIdAsync(id, ownerId, updateEventData, cancellationToken);
            var result = _mapper.Map<UpdateEventByIdResultModel>(updatedEventEntity);

            return StatusCode(StatusCodes.Status200OK, result);
        }
        catch (NotFoundEventWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundEventWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch (NotEnoughEventAuthorityException exception)
        {
            ModelState.AddModelError("eventUser",
                _errorMessagesManager.NotEnoughEventAuthority(exception.RequiredRole));
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch (TitleWithDescriptionAlreadyInUseException)
        {
            ModelState.AddModelError($"{nameof(dataModel.Title)} and {nameof(dataModel.Description)}",
                _errorMessagesManager.TitleWithDescriptionAlreadyInUse());
            return StatusCode(StatusCodes.Status409Conflict, ModelState);
        }
        catch (StartDateLessThanCurrentDateException)
        {
            ModelState.AddModelError(nameof(dataModel.StartsAt), _errorMessagesManager.StartDateLessThanCurrentDate());
            return StatusCode(StatusCodes.Status400BadRequest, ModelState);
        }
        catch (InvalidEventDurationException)
        {
            ModelState.AddModelError($"{nameof(dataModel.StartsAt)} and {nameof(dataModel.EndsAt)}",
                _errorMessagesManager.InvalidEventDuration(_minEventMinutesDuration));
            return StatusCode(StatusCodes.Status400BadRequest, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    ///     Delete event by event id
    /// </summary>
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var ownerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var deletedEventEntity = await _eventService.DeleteByIdWithOwnerIdAsync(id, ownerId, cancellationToken);
            var result = _mapper.Map<DeleteEventByIdResultModel>(deletedEventEntity);

            return StatusCode(StatusCodes.Status200OK, result);
        }
        catch (NotFoundEventWithSpecifiedIdException)
        {
            ModelState.AddModelError(nameof(id), _errorMessagesManager.NotFoundEventWithSpecifiedId());
            return StatusCode(StatusCodes.Status404NotFound, ModelState);
        }
        catch (NotEnoughEventAuthorityException exception)
        {
            ModelState.AddModelError("eventUser",
                _errorMessagesManager.NotEnoughEventAuthority(exception.RequiredRole));
            return StatusCode(StatusCodes.Status401Unauthorized, ModelState);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}