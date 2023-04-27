using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class MaxFieldLengthAttribute : MaxLengthAttribute
{
    public MaxFieldLengthAttribute(int length) : base(length)
    {
        ErrorMessage = ErrorMessagesManager.Instance.InvalidAttributeMaxFieldLength(length);
    }
}