using System.ComponentModel.DataAnnotations;
using FleetManager.Model.Enums;

namespace FleetManager.Dto;

public class VehicleStatusUpdateDto
{
    [Required,EnumDataType(typeof(Status))]
    public Status Status { get; set; }
    
}