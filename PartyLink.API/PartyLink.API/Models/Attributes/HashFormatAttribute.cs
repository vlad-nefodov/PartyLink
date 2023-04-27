using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class HashFormatAttribute : ValidationAttribute
{
    private readonly int _length;

    public HashFormatAttribute(int length) : base(ErrorMessagesManager.Instance.InvalidAttributeHashFormat(length))
    {
        _length = length;
    }

    public override bool IsValid(object? value)
    {
        if (value is not string valueAsString) return false;
        if (string.IsNullOrWhiteSpace(valueAsString)) return false;

        return valueAsString.Length == _length &&
               valueAsString.All(char.IsAsciiHexDigit);
    }
}