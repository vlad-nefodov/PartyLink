using AutoMapper;
using PartyLink.API.Models.ResultModels;
using PartyLink.Domain.Entities;

namespace PartyLink.API.Models;

public class CommonMapperProfile : Profile
{
    public CommonMapperProfile()
    {
        CreateMap<Avatar, AvatarResultModel>();
    }
}