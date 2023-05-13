using AutoMapper;
using PartyLink.API.Controllers.EventController.Models.DataModels;
using PartyLink.API.Controllers.EventController.Models.ResultModels;
using PartyLink.Domain.Entities;
using PartyLink.Domain.Entities.Enums;
using PartyLink.Services.Services.EventService.Dto;

namespace PartyLink.API.Controllers.EventController;

public class EventControllerMapperProfile : Profile
{
    public EventControllerMapperProfile()
    {
        // GetAll
        CreateMap<Event, GetAllEventsResultModel>()
            .ForMember(rm => rm.OwnerUser, opts => opts.MapFrom(e => GetOwnerUser(e)))
            .ForMember(rm => rm.ParticipantsCount, opts => opts.MapFrom(e => e.Users.Count));
        CreateMap<EventLocation, EventLocationResultModel>();
        CreateMap<EventTag, EventTagResultModel>();

        // GetById
        CreateMap<Event, GetEventByIdResultModel>()
            .ForMember(rm => rm.OwnerUser, opts => opts.MapFrom(e => GetOwnerUser(e)))
            .ForMember(rm => rm.Participants, opts => opts.MapFrom(e => e.Users));
        CreateMap<EventUser, EventUserResultModel>()
            .ForMember(rm => rm.Id, opts => opts.MapFrom(eu => eu.User.Id))
            .ForMember(rm => rm.EventUserRole, opts => opts.MapFrom(eu => eu.EventUserRole))
            .ForMember(rm => rm.Name, opts => opts.MapFrom(eu => eu.User.Name))
            .ForMember(rm => rm.Surname, opts => opts.MapFrom(eu => eu.User.Surname))
            .ForMember(rm => rm.Avatar, opts => opts.MapFrom(eu => eu.User.Avatar));

        // Create
        CreateMap<CreateEventDataModel, CreateEventData>();
        CreateMap<EventLocationDataModel, EventLocationData>();
        CreateMap<EventTagDataModel, EventTagData>();
        CreateMap<Event, CreateEventResultModel>();

        // UpdateById
        CreateMap<UpdateEventByIdDataModel, UpdateEventData>();
        CreateMap<Event, UpdateEventByIdResultModel>();

        // DeleteById
        CreateMap<Event, DeleteEventByIdResultModel>();
    }

    private static EventUser? GetOwnerUser(Event e)
    {
        return e.Users.SingleOrDefault(u => u.EventUserRole == EventUserRole.Owner);
    }
}