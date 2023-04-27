using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class EmailFormatAttribute : ValidationAttribute
{
    private const string _emailRegex = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

    public EmailFormatAttribute()
    {
        ErrorMessage = ErrorMessagesManager.Instance.InvalidAttributeEmailFormat();
    }

    public override bool IsValid(object? value)
    {
        if (value is not string valueAsString) return false;
        if (string.IsNullOrWhiteSpace(valueAsString)) return false;

        return new Regex(_emailRegex).IsMatch(valueAsString);
    }
}