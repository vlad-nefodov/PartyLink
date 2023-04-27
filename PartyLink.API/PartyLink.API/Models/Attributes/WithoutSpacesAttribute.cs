using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class WithoutSpacesAttribute : ValidationAttribute
{
    public WithoutSpacesAttribute() : base(ErrorMessagesManager.Instance.InvalidAttributeWithoutSpaces())
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is not string valueAsString) return false;

        return !string.IsNullOrWhiteSpace(valueAsString);
    }
}