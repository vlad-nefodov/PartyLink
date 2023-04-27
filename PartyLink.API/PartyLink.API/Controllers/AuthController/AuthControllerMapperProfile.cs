using AutoMapper;
using PartyLink.API.Controllers.AuthController.Models.DataModels;
using PartyLink.Services.AuthService.Dto;

namespace PartyLink.API.Controllers.AuthController;

public class AuthControllerMapperProfile : Profile
{
    public AuthControllerMapperProfile()
    {
        // Login
        CreateMap<LoginDataModel, LoginData>();
    }
}