using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;
using PartyLink.Domain.Entities.Enums;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class GenderFormatAttribute : ValidationAttribute
{
    public GenderFormatAttribute() : base(ErrorMessagesManager.Instance.InvalidAttributeGenderFormat())
    {
    }

    public override bool IsValid(object? value)
    {
        return value is Gender;
    }
}