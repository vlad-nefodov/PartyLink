using System.ComponentModel.DataAnnotations;
using PartyLink.API.Configuration.Managers;

namespace PartyLink.API.Models.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class LatitudeFormatAttribute : ValidationAttribute
{
    private const double _minValue = -90;
    private const double _maxValue = 90;

    public LatitudeFormatAttribute() : base(ErrorMessagesManager.Instance.InvalidAttributeLatitudeFormat())
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is not double valueAsDouble) return false;

        return valueAsDouble is >= _minValue and <= _maxValue;
    }
}