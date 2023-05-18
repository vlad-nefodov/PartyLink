using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PartyLink.Domain.Entities;
using PartyLink.Domain.Entities.Enums;
using PartyLink.Repositories.Interfaces;
using PartyLink.Services.Exceptions;
using PartyLink.Services.Services.EventService.Dto;
using PartyLink.Services.Services.EventService.Exceptions;
using PartyLink.Services.Services.Interfaces;

namespace PartyLink.Services.Services.EventService;

public class EventService : IEventService
{
    private const int _minEventMinutesDuration = 30;
    private readonly IEventRepository _eventRepository;
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepository;

    public EventService(IMapper mapper, IUserRepository userRepository, IEventRepository eventRepository)
    {
        _mapper = mapper;
        _userRepository = userRepository;
        _eventRepository = eventRepository;
    }

    public async Task<IEnumerable<Event>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var eventEntities = await _eventRepository.GetAll().ToListAsync(cancellationToken);

        // Detach
        _eventRepository.DetachAll(eventEntities);
        return eventEntities;
    }

    public async Task<Event> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(id, cancellationToken) ??
                          throw new NotFoundEventWithSpecifiedIdException(id);
        // Detach
        _eventRepository.Detach(eventEntity);
        return eventEntity;
    }

    public async Task<Event> CreateWithOwnerIdAsync(Guid ownerId, CreateEventData data,
        CancellationToken cancellationToken = default)
    {
        if (data == null) throw new ArgumentNullException(nameof(data));
        var owner = await _userRepository.GetByIdAsync(ownerId, cancellationToken) ??
                    throw new NotFoundUserWithSpecifiedIdException(ownerId);

        if (await IsTitleWithDescriptionAlreadyInUseAsync(data.Title, data.Description, Guid.Empty, cancellationToken))
            throw new TitleWithDescriptionAlreadyInUseException(data.Title, data.Description);

        var currentDate = DateTime.Now;
        if (data.StartsAt < currentDate)
            throw new StartDateLessThanCurrentDateException(data.StartsAt, currentDate);

        var minEndsAt = data.StartsAt.AddMinutes(_minEventMinutesDuration);
        if (data.EndsAt < minEndsAt)
            throw new InvalidEventDurationException(data.EndsAt, minEndsAt);

        // Create event
        var eventEntityWithDataToCreate = _mapper.Map<Event>(data);
        eventEntityWithDataToCreate.Users.Add(new EventUser
        {
            User = owner,
            EventUserRole = EventUserRole.Owner
        });
        var createdEventEntity = await _eventRepository.AddAsync(eventEntityWithDataToCreate, cancellationToken);

        // Save changes and Detach
        await _eventRepository.SaveAsync(cancellationToken);
        _eventRepository.Detach(createdEventEntity);

        return createdEventEntity;
    }

    public async Task<Event> UpdateByIdWithOwnerIdAsync(Guid id, Guid ownerId, UpdateEventData data,
        CancellationToken cancellationToken = default)
    {
        if (data == null) throw new ArgumentNullException(nameof(data));

        var currentDate = DateTime.Now;
        if (data.StartsAt < currentDate)
            throw new StartDateLessThanCurrentDateException(data.StartsAt, currentDate);

        var minEndsAt = data.StartsAt.AddMinutes(_minEventMinutesDuration);
        if (data.EndsAt < minEndsAt)
            throw new InvalidEventDurationException(data.EndsAt, minEndsAt);

        // Get event to update
        var eventEntityToUpdate = await _eventRepository.GetByIdAsync(id, cancellationToken) ??
                                  throw new NotFoundEventWithSpecifiedIdException(id);

        if (await IsTitleWithDescriptionAlreadyInUseAsync(data.Title, data.Description, eventEntityToUpdate.Id,
                cancellationToken))
            throw new TitleWithDescriptionAlreadyInUseException(data.Title, data.Description);

        // Credentials check
        if (!IsEventOwner(eventEntityToUpdate, ownerId))
            throw new NotEnoughEventAuthorityException(id, ownerId, EventUserRole.Owner);

        // Update event
        var eventEntityWithDataToUpdate = _mapper.Map(data, eventEntityToUpdate);
        var updatedEventEntity = _eventRepository.Update(eventEntityWithDataToUpdate);

        // Save changes and Detach
        await _eventRepository.SaveAsync(cancellationToken);
        _eventRepository.Detach(updatedEventEntity);

        return updatedEventEntity;
    }

    public async Task<Event> DeleteByIdWithOwnerIdAsync(Guid id, Guid ownerId,
        CancellationToken cancellationToken = default)
    {
        // Get event to delete
        var eventEntityToDelete = await _eventRepository.GetByIdAsync(id, cancellationToken) ??
                                  throw new NotFoundEventWithSpecifiedIdException(id);

        // Credentials check
        if (!IsEventOwner(eventEntityToDelete, ownerId))
            throw new NotEnoughEventAuthorityException(id, ownerId, EventUserRole.Owner);

        // Delete event
        var deletedEventEntity = _eventRepository.Remove(eventEntityToDelete);

        // Save changes and Detach
        await _eventRepository.SaveAsync(cancellationToken);
        _eventRepository.Detach(deletedEventEntity);

        return deletedEventEntity;
    }

    public async Task JoinEventAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        // Get event
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken) ??
                                  throw new NotFoundEventWithSpecifiedIdException(eventId);

        // Get user
        var userEntity = await _userRepository.GetByIdAsync(userId, cancellationToken) ??
                         throw new NotFoundUserWithSpecifiedIdException(userId);

        if (eventEntity.Users.Any(u => u.UserId == userEntity.Id))
            throw new UserIsAlreadyJoinedException(eventId, userId);

        eventEntity.Users.Add(new EventUser
        {
            User = userEntity,
            EventUserRole = EventUserRole.Participant
        });

        // Save changes
        await _eventRepository.SaveAsync(cancellationToken);
    }

    public async Task LeaveEventAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
    {
        // Get event
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken) ??
                          throw new NotFoundEventWithSpecifiedIdException(eventId);

        // Get user
        var userEntity = await _userRepository.GetByIdAsync(userId, cancellationToken) ??
                         throw new NotFoundUserWithSpecifiedIdException(userId);

        var eventUserEntity = eventEntity.Users.SingleOrDefault(eu => eu.UserId == userEntity.Id);
        if (eventUserEntity == null)
            throw new UserIsNotJoinedException(eventId, userId);

        eventEntity.Users.Remove(eventUserEntity);

        // Save changes
        await _eventRepository.SaveAsync(cancellationToken);
    }

    private async Task<bool> IsTitleWithDescriptionAlreadyInUseAsync(string title, string description, Guid eventId,
        CancellationToken cancellationToken = default)
    {
        return await _eventRepository.GetAll()
            .AnyAsync(e => e.Id != eventId &&
                           e.Title == title &&
                           e.Description == description, cancellationToken);
    }

    private static bool IsEventOwner(Event eventEntity, Guid ownerId)
    {
        return eventEntity.Users.Any(eu => eu.UserId == ownerId && eu.EventUserRole == EventUserRole.Owner);
    }
}