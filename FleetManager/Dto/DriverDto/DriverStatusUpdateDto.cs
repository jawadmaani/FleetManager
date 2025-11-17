using System.ComponentModel.DataAnnotations;
using FleetManager.Model.Enums;

namespace FleetManager.Dto.DriverDto;

public class DriverStatusUpdateDto
{
   
    [Required,EnumDataType(typeof(Status))]
    public Status Status { get; set; }    
}