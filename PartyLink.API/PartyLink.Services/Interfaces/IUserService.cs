using PartyLink.Domain.Entities;
using PartyLink.Services.UserService.Dto;

namespace PartyLink.Services.Interfaces;

public interface IUserService
{
    public Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);

    public Task<User> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    public Task<User> CreateAsync(CreateUserData data, CancellationToken cancellationToken = default);

    public Task<User> UpdateByIdAsync(Guid id, UpdateUserData data, CancellationToken cancellationToken = default);

    public Task<User> UpdateEmailByIdAsync(Guid id, UpdateUserEmailData data,
        CancellationToken cancellationToken = default);

    public Task<User> UpdateMobilePhoneByIdAsync(Guid id, UpdateUserMobilePhoneData data,
        CancellationToken cancellationToken = default);

    public Task<User> UpdatePasswordByIdAsync(Guid id, UpdateUserPasswordData data,
        CancellationToken cancellationToken = default);

    public Task<User> DeleteByIdAsync(Guid id, DeleteUserData data, CancellationToken cancellationToken = default);
}