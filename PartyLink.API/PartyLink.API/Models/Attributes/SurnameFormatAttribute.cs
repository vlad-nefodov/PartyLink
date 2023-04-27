using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class SurnameFormatAttribute : ValidationAttribute
{
    public SurnameFormatAttribute() : base(ErrorMessagesManager.Instance.InvalidAttributeSurnameFormat())
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is not string valueAsString) return false;
        if (string.IsNullOrWhiteSpace(valueAsString)) return false;

        return valueAsString.All(char.IsLetter) &&
               char.IsUpper(valueAsString[0]) &&
               valueAsString.Skip(1).All(char.IsLower);
    }
}