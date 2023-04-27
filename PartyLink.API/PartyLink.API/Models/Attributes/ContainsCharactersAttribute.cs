using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class ContainsCharactersAttribute : ValidationAttribute
{
    public ContainsCharactersAttribute() : base(ErrorMessagesManager.Instance.InvalidAttributeContainsCharacters())
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is not string valueAsString) return false;
        if (string.IsNullOrWhiteSpace(valueAsString)) return false;

        return valueAsString.Any(char.IsLetter);
    }
}