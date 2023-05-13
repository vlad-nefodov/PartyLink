using AutoMapper;
using PartyLink.Domain.Entities;
using PartyLink.Services.Services.EventService.Dto;

namespace PartyLink.Services.Services.EventService;

public class EventServiceMapperProfile : Profile
{
    public EventServiceMapperProfile()
    {
        // Create
        CreateMap<CreateEventData, Event>();
        CreateMap<EventLocationData, EventLocation>();
        CreateMap<EventTagData, EventTag>();

        // UpdateById
        CreateMap<UpdateEventData, Event>();
    }
}