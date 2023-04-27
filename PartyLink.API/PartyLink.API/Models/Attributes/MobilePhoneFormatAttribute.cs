using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public class MobilePhoneFormatAttribute : ValidationAttribute
{
    private const string _mobilePhoneRegex = @"^\+\d{1,3}\d{7,14}$";

    public MobilePhoneFormatAttribute()
    {
        ErrorMessage = ErrorMessagesManager.Instance.InvalidAttributeMobilePhoneFormat();
    }

    public override bool IsValid(object? value)
    {
        if (value is not string valueAsString) return false;
        if (string.IsNullOrWhiteSpace(valueAsString)) return false;

        return new Regex(_mobilePhoneRegex).IsMatch(valueAsString);
    }
}