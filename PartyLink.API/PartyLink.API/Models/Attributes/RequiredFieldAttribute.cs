using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class RequiredFieldAttribute : RequiredAttribute
{
    public RequiredFieldAttribute()
    {
        ErrorMessage = ErrorMessagesManager.Instance.InvalidAttributeRequiredField();
    }
}