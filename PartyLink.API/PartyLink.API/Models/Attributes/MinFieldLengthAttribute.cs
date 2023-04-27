using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class MinFieldLengthAttribute : MinLengthAttribute
{
    public MinFieldLengthAttribute(int length) : base(length)
    {
        ErrorMessage = ErrorMessagesManager.Instance.InvalidAttributeMinFieldLength(length);
    }
}