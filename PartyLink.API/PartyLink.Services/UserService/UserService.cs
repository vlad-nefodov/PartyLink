using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PartyLink.Domain.Entities;
using PartyLink.Repositories.Interfaces;
using PartyLink.Services.Exceptions;
using PartyLink.Services.Helpers.Interfaces;
using PartyLink.Services.Interfaces;
using PartyLink.Services.UserService.Dto;
using PartyLink.Services.UserService.Exceptions;

namespace PartyLink.Services.UserService;

public class UserService : IUserService
{
    private readonly IHashHelper _hashHelper;
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository, IMapper mapper, IHashHelper hashHelper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _hashHelper = hashHelper;
    }

    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.GetAll().ToListAsync(cancellationToken);

        // Detach
        _userRepository.DetachAll(users);
        return users;
    }

    public async Task<User> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken) ??
                   throw new NotFoundUserWithSpecifiedIdException(id);
        // Detach
        _userRepository.Detach(user);
        return user;
    }

    public async Task<User> CreateAsync(CreateUserData data, CancellationToken cancellationToken = default)
    {
        if (data == null) throw new ArgumentNullException(nameof(data));
        if (await IsEmailAlreadyInUseAsync(data.Email, cancellationToken))
            throw new EmailAlreadyInUseException(data.Email);
        if (await IsMobilePhoneAlreadyInUseAsync(data.MobilePhone, cancellationToken))
            throw new MobilePhoneAlreadyInUseException(data.MobilePhone);

        // Create password hash
        var passwordHash = await _hashHelper.GetHashFromAsync(data.Password, cancellationToken);
        if (await IsPasswordHashAlreadyInUseAsync(passwordHash, cancellationToken))
            throw new PasswordAlreadyInUseException(passwordHash);

        // Create user
        var userWithDataToCreate = _mapper.Map<User>(data);
        userWithDataToCreate.PasswordHash = passwordHash;
        var createdUser = await _userRepository.AddAsync(userWithDataToCreate, cancellationToken);

        // Save changes and Detach
        await _userRepository.SaveAsync(cancellationToken);
        _userRepository.Detach(createdUser);

        return createdUser;
    }

    public async Task<User> UpdateByIdAsync(Guid id, UpdateUserData data,
        CancellationToken cancellationToken = default)
    {
        if (data == null) throw new ArgumentNullException(nameof(data));

        // Get user to update
        var userToUpdate = await _userRepository.GetByIdAsync(id, cancellationToken) ??
                           throw new NotFoundUserWithSpecifiedIdException(id);
        // Update user
        var userWithDataToUpdate = _mapper.Map(data, userToUpdate);
        var updatedUser = _userRepository.Update(userWithDataToUpdate);

        // Save changes and Detach
        await _userRepository.SaveAsync(cancellationToken);
        _userRepository.Detach(updatedUser);

        return updatedUser;
    }

    public async Task<User> UpdateEmailByIdAsync(Guid id, UpdateUserEmailData data,
        CancellationToken cancellationToken = default)
    {
        if (data == null) throw new ArgumentNullException(nameof(data));

        // Get user to update
        var userToUpdate = await _userRepository.GetByIdAsync(id, cancellationToken) ??
                           throw new NotFoundUserWithSpecifiedIdException(id);

        // Compare password hashes
        if (userToUpdate.PasswordHash.ToUpper() != data.PasswordHash.ToUpper())
            throw new InvalidPasswordHashException(data.PasswordHash);
        if (await IsEmailAlreadyInUseAsync(data.NewEmail, cancellationToken))
            throw new EmailAlreadyInUseException(data.NewEmail);

        // Update user email
        var userWithDataToUpdate = _mapper.Map(data, userToUpdate);
        var updatedUser = _userRepository.Update(userWithDataToUpdate);

        // Save changes and Detach
        await _userRepository.SaveAsync(cancellationToken);
        _userRepository.Detach(updatedUser);

        return updatedUser;
    }

    public async Task<User> UpdateMobilePhoneByIdAsync(Guid id, UpdateUserMobilePhoneData data,
        CancellationToken cancellationToken = default)
    {
        if (data == null) throw new ArgumentNullException(nameof(data));

        // Get user to update
        var userToUpdate = await _userRepository.GetByIdAsync(id, cancellationToken) ??
                           throw new NotFoundUserWithSpecifiedIdException(id);

        // Compare password hashes
        if (userToUpdate.PasswordHash.ToUpper() != data.PasswordHash.ToUpper())
            throw new InvalidPasswordHashException(data.PasswordHash);
        if (await IsMobilePhoneAlreadyInUseAsync(data.NewMobilePhone, cancellationToken))
            throw new MobilePhoneAlreadyInUseException(data.NewMobilePhone);

        // Update user mobile phone
        var userWithDataToUpdate = _mapper.Map(data, userToUpdate);
        var updatedUser = _userRepository.Update(userWithDataToUpdate);

        // Save changes and Detach
        await _userRepository.SaveAsync(cancellationToken);
        _userRepository.Detach(updatedUser);

        return updatedUser;
    }

    public async Task<User> UpdatePasswordByIdAsync(Guid id, UpdateUserPasswordData data,
        CancellationToken cancellationToken = default)
    {
        if (data == null) throw new ArgumentNullException(nameof(data));

        // Get user to update
        var userToUpdate = await _userRepository.GetByIdAsync(id, cancellationToken) ??
                           throw new NotFoundUserWithSpecifiedIdException(id);

        // Compare password hashes
        if (userToUpdate.PasswordHash.ToUpper() != data.PasswordHash.ToUpper())
            throw new InvalidPasswordHashException(data.PasswordHash);

        // Create password hash
        var passwordHash = await _hashHelper.GetHashFromAsync(data.NewPassword, cancellationToken);
        if (await IsPasswordHashAlreadyInUseAsync(passwordHash, cancellationToken))
            throw new PasswordAlreadyInUseException(passwordHash);

        // Update user password hash
        userToUpdate.PasswordHash = passwordHash;
        var updatedUser = _userRepository.Update(userToUpdate);

        // Save changes and Detach
        await _userRepository.SaveAsync(cancellationToken);
        _userRepository.Detach(updatedUser);

        return updatedUser;
    }

    public async Task<User> DeleteByIdAsync(Guid id, DeleteUserData data, CancellationToken cancellationToken = default)
    {
        // Get user to delete
        var userToDelete = await _userRepository.GetByIdAsync(id, cancellationToken) ??
                           throw new NotFoundUserWithSpecifiedIdException(id);

        // Compare password hashes
        if (userToDelete.PasswordHash.ToUpper() != data.PasswordHash.ToUpper())
            throw new InvalidPasswordHashException(data.PasswordHash);

        // Delete user
        var deletedUser = _userRepository.Remove(userToDelete);

        // Save changes and Detach
        await _userRepository.SaveAsync(cancellationToken);
        _userRepository.Detach(deletedUser);

        return deletedUser;
    }

    public async Task<User> UploadAvatarByIdAsync(Guid id, string base64Image,
        CancellationToken cancellationToken = default)
    {
        if (base64Image == null) throw new ArgumentNullException(nameof(base64Image));

        // Get user to update
        var userToUpdate = await _userRepository.GetByIdAsync(id, cancellationToken) ??
                           throw new NotFoundUserWithSpecifiedIdException(id);
        // Upload avatar
        userToUpdate.Avatar = new Avatar {Base64Image = base64Image};
        var updatedUser = _userRepository.Update(userToUpdate);

        // Save changes and Detach
        await _userRepository.SaveAsync(cancellationToken);
        _userRepository.Detach(updatedUser);

        return updatedUser;
    }

    private async Task<bool> IsEmailAlreadyInUseAsync(string email,
        CancellationToken cancellationToken = default)
    {
        return await _userRepository.GetAll().AnyAsync(u => u.Email == email, cancellationToken);
    }

    private async Task<bool> IsMobilePhoneAlreadyInUseAsync(string mobilePhone,
        CancellationToken cancellationToken = default)
    {
        return await _userRepository.GetAll().AnyAsync(u => u.MobilePhone == mobilePhone, cancellationToken);
    }

    private async Task<bool> IsPasswordHashAlreadyInUseAsync(string passwordHash,
        CancellationToken cancellationToken = default)
    {
        return await _userRepository.GetAll().AnyAsync(u => u.PasswordHash == passwordHash, cancellationToken);
    }
}