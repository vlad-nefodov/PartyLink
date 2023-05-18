using PartyLink.Domain.Entities.Enums;

namespace PartyLink.API.Configuration.Managers.Interfaces;

public interface IErrorMessagesManager
{
    public string NotFoundUserWithSpecifiedId();
    public string NotFoundUserWithSpecifiedRefreshTokenHash();
    public string EmailAlreadyInUse();
    public string MobilePhoneAlreadyInUse();
    public string PasswordAlreadyInUse();
    public string InvalidPasswordHash();
    public string InvalidLogin();
    public string InvalidRefreshToken();

    public string NotFoundEventWithSpecifiedId();
    public string TitleWithDescriptionAlreadyInUse();
    public string StartDateLessThanCurrentDate();
    public string InvalidEventDuration(int minMinutesDuration);
    public string NotEnoughEventAuthority(EventUserRole requiredRole);
    public string UserIsAlreadyJoined();
    public string UserIsNotJoined();

    public string InvalidAttributeRequiredField();
    public string InvalidAttributeMinFieldLength(int length);
    public string InvalidAttributeMaxFieldLength(int length);
    public string InvalidAttributeMaxCollectionCount(int maxCount);
    public string InvalidAttributeContainsCharacters();
    public string InvalidAttributeContainsNumbers();
    public string InvalidAttributeWithoutSpaces();
    public string InvalidAttributeNameFormat();
    public string InvalidAttributeSurnameFormat();
    public string InvalidAttributeGenderFormat();
    public string InvalidAttributeEmailFormat();
    public string InvalidAttributeMobilePhoneFormat();
    public string InvalidAttributeLoginFormat();
    public string InvalidAttributeHashFormat(int length);
    public string InvalidAttributeLatitudeFormat();
    public string InvalidAttributeLongitudeFormat();
}