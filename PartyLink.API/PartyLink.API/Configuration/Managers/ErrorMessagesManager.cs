using PartyLink.API.Configuration.Managers.Interfaces;
using PartyLink.Domain.Entities.Enums;

namespace PartyLink.API.Configuration.Managers;

public sealed class ErrorMessagesManager : IErrorMessagesManager
{
    private const string _messagesPathName = "ErrorMessages";
    private const string _messagesPath = $"{_messagesPathName}:";
    private const string _invalidAttributePathName = "InvalidAttribute";
    private const string _invalidAttributePath = $"{_messagesPath}{_invalidAttributePathName}:";
    private static readonly Lazy<ErrorMessagesManager> lazy = new(() => new ErrorMessagesManager());
    private static ConfigurationManager _configuration = null!;

    private ErrorMessagesManager()
    {
    }

    public static ErrorMessagesManager Instance
    {
        get
        {
            if (_configuration == null) throw new ArgumentNullException(nameof(_configuration));
            return lazy.Value;
        }
    }

    public string NotFoundUserWithSpecifiedId()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(NotFoundUserWithSpecifiedId)}"]!);
    }

    public string NotFoundUserWithSpecifiedRefreshTokenHash()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(NotFoundUserWithSpecifiedRefreshTokenHash)}"]!);
    }

    public string EmailAlreadyInUse()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(EmailAlreadyInUse)}"]!);
    }

    public string MobilePhoneAlreadyInUse()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(MobilePhoneAlreadyInUse)}"]!);
    }

    public string PasswordAlreadyInUse()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(PasswordAlreadyInUse)}"]!);
    }

    public string InvalidPasswordHash()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(InvalidPasswordHash)}"]!);
    }

    public string InvalidLogin()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(InvalidLogin)}"]!);
    }

    public string InvalidRefreshToken()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(InvalidRefreshToken)}"]!);
    }

    public string NotFoundEventWithSpecifiedId()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(NotFoundEventWithSpecifiedId)}"]!);
    }

    public string TitleWithDescriptionAlreadyInUse()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(TitleWithDescriptionAlreadyInUse)}"]!);
    }

    public string StartDateLessThanCurrentDate()
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(StartDateLessThanCurrentDate)}"]!);
    }

    public string InvalidEventDuration(int minMinutesDuration)
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(InvalidEventDuration)}"]!, minMinutesDuration);
    }

    public string NotEnoughEventAuthority(EventUserRole requiredRole)
    {
        return string.Format(_configuration[$"{_messagesPath}{nameof(NotEnoughEventAuthority)}"]!, requiredRole);
    }

    public string InvalidAttributeRequiredField()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}RequiredField"]!);
    }

    public string InvalidAttributeMinFieldLength(int length)
    {
        return string.Format(_configuration[$"{_invalidAttributePath}MinFieldLength"]!, length);
    }

    public string InvalidAttributeMaxFieldLength(int length)
    {
        return string.Format(_configuration[$"{_invalidAttributePath}MaxFieldLength"]!, length);
    }

    public string InvalidAttributeMaxCollectionCount(int maxCount)
    {
        return string.Format(_configuration[$"{_invalidAttributePath}MaxCollectionCount"]!, maxCount);
    }

    public string InvalidAttributeContainsCharacters()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}ContainsCharacters"]!);
    }

    public string InvalidAttributeContainsNumbers()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}ContainsNumbers"]!);
    }

    public string InvalidAttributeWithoutSpaces()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}WithoutSpaces"]!);
    }

    public string InvalidAttributeNameFormat()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}NameFormat"]!);
    }

    public string InvalidAttributeSurnameFormat()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}SurnameFormat"]!);
    }

    public string InvalidAttributeGenderFormat()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}GenderFormat"]!);
    }

    public string InvalidAttributeEmailFormat()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}EmailFormat"]!);
    }

    public string InvalidAttributeMobilePhoneFormat()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}MobilePhoneFormat"]!);
    }

    public string InvalidAttributeLoginFormat()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}LoginFormat"]!);
    }

    public string InvalidAttributeHashFormat(int length)
    {
        return string.Format(_configuration[$"{_invalidAttributePath}HashFormat"]!, length);
    }

    public string InvalidAttributeLatitudeFormat()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}LatitudeFormat"]!);
    }

    public string InvalidAttributeLongitudeFormat()
    {
        return string.Format(_configuration[$"{_invalidAttributePath}LongitudeFormat"]!);
    }

    public static ConfigurationManager Configure(ConfigurationManager configuration)
    {
        return _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }
}