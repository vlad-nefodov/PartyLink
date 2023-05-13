using System.Collections;
using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class MaxCollectionCountAttribute : ValidationAttribute
{
    private readonly int _maxCount;

    public MaxCollectionCountAttribute(int maxCount) :
        base(ErrorMessagesManager.Instance.InvalidAttributeMaxCollectionCount(maxCount))
    {
        _maxCount = maxCount;
    }

    public override bool IsValid(object? value)
    {
        if (value is not ICollection valueAsCollection) return false;

        return valueAsCollection.Count <= _maxCount;
    }
}