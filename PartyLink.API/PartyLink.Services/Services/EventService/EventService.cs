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

        if (await IsTitleWithDescriptionAlreadyInUseAsync(data.Title, data.Description, cancellationToken))
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

        if (await IsTitleWithDescriptionAlreadyInUseAsync(data.Title, data.Description, cancellationToken))
            throw new TitleWithDescriptionAlreadyInUseException(data.Title, data.Description);

        var currentDate = DateTime.Now;
        if (data.StartsAt < currentDate)
            throw new StartDateLessThanCurrentDateException(data.StartsAt, currentDate);

        var minEndsAt = data.StartsAt.AddMinutes(_minEventMinutesDuration);
        if (data.EndsAt < minEndsAt)
            throw new InvalidEventDurationException(data.EndsAt, minEndsAt);

        // Get event to update
        var eventEntityToUpdate = await _eventRepository.GetByIdAsync(id, cancellationToken) ??
                                  throw new NotFoundEventWithSpecifiedIdException(id);

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

    private async Task<bool> IsTitleWithDescriptionAlreadyInUseAsync(string title, string description,
        CancellationToken cancellationToken = default)
    {
        return await _eventRepository.GetAll()
            .AnyAsync(e => e.Title == title && e.Description == description, cancellationToken);
    }

    private static bool IsEventOwner(Event eventEntity, Guid ownerId)
    {
        return eventEntity.Users.Any(eu => eu.UserId == ownerId && eu.EventUserRole == EventUserRole.Owner);
    }
}