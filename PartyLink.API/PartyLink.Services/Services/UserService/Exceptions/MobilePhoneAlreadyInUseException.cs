namespace PartyLink.Services.Services.UserService.Exceptions;

public class MobilePhoneAlreadyInUseException : Exception
{
    public MobilePhoneAlreadyInUseException(string mobilePhone) : base($"Mobile phone {mobilePhone} already in use.")
    {
        MobilePhone = mobilePhone;
    }

    public string MobilePhone { get; }
}