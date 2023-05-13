using AutoMapper;
using PartyLink.Domain.Entities;
using PartyLink.Services.Services.UserService.Dto;

namespace PartyLink.Services.Services.UserService;

public class UserServiceMapperProfile : Profile
{
    public UserServiceMapperProfile()
    {
        // Create
        CreateMap<CreateUserData, User>();

        // UpdateById
        CreateMap<UpdateUserData, User>()
            .ForMember(u => u.Name, opts => opts.MapFrom(ud => ud.NewName))
            .ForMember(u => u.Surname, opts => opts.MapFrom(ud => ud.NewSurname))
            .ForMember(u => u.Gender, opts => opts.MapFrom(uud => uud.NewGender));

        // UpdateEmailById
        CreateMap<UpdateUserEmailData, User>()
            .ForMember(u => u.Email, opts => opts.MapFrom(uue => uue.NewEmail));

        // UpdatePhoneById
        CreateMap<UpdateUserMobilePhoneData, User>()
            .ForMember(u => u.MobilePhone, opts => opts.MapFrom(uue => uue.NewMobilePhone));
    }
}