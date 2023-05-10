using AutoMapper;
using PartyLink.API.Controllers.AuthController.Models.DataModels;
using PartyLink.API.Controllers.UserController.Models.DataModels;
using PartyLink.API.Controllers.UserController.Models.ResultModels;
using PartyLink.Domain.Entities;
using PartyLink.Services.UserService.Dto;

namespace PartyLink.API.Controllers.UserController;

public class UserControllerMapperProfile : Profile
{
    public UserControllerMapperProfile()
    {
        // GetAll
        CreateMap<User, GetAllUsersResultModel>();

        // GetById
        CreateMap<User, GetUserByIdResultModel>();
        CreateMap<Avatar, AvatarResultModel>();

        // Create
        CreateMap<CreateUserDataModel, CreateUserData>();
        CreateMap<User, CreateUserResultModel>();

        // UpdateById
        CreateMap<UpdateUserDataModel, UpdateUserData>();
        CreateMap<User, UpdateUserByIdResultModel>();

        // UploadAvatarById
        CreateMap<AvatarDataModel, Avatar>();
        CreateMap<User, UploadUserAvatarByIdResultModel>();

        // UpdateEmailById
        CreateMap<UpdateUserEmailDataModel, UpdateUserEmailData>();
        CreateMap<User, UpdateUserEmailByIdResultModel>();

        // UpdatePhoneById
        CreateMap<UpdateUserMobilePhoneDataModel, UpdateUserMobilePhoneData>();
        CreateMap<User, UpdateUserMobilePhoneByIdResultModel>();

        // UpdatePasswordById
        CreateMap<UpdateUserPasswordDataModel, UpdateUserPasswordData>();
        CreateMap<User, UpdateUserPasswordByIdResultModel>();

        // Delete
        CreateMap<DeleteUserDataModel, DeleteUserData>();
        CreateMap<User, DeleteUserByIdResultModel>();
    }
}