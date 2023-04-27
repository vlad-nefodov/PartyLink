using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class ContainsNumbersAttribute : ValidationAttribute
{
    public ContainsNumbersAttribute() : base(ErrorMessagesManager.Instance.InvalidAttributeContainsNumbers())
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is not string valueAsString) return false;
        if (string.IsNullOrWhiteSpace(valueAsString)) return false;

        return valueAsString.Any(char.IsNumber);
    }
}