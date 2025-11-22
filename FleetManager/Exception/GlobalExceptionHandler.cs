using FleetManager.Exception.AccessTokenExceptions;
using FleetManager.Exception.DriverExceptions;
using FleetManager.Exception.MaintenanceLogExceptions;
using FleetManager.Exception.RefreshTokenExceptions;
using FleetManager.Exception.UserExceptions;
using FleetManager.Exception.VehicleExceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

[ApiController]
public class GlobalExceptionHandler : ControllerBase
{
    [Route("/error")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult HandleError()
    {
        var context = HttpContext.Features.Get<IExceptionHandlerFeature>();

        // User Exceptions
        if (context?.Error is UserNotFoundException)
            return NotFound(new { message = context.Error.Message });

        if (context?.Error is NoUsersFoundException)
            return NotFound(new { message = context.Error.Message });

        if (context?.Error is InvalidCredentialsException)
            return Unauthorized(new { message = context.Error.Message });

        if (context?.Error is UserAlreadyExistsException)
            return Conflict(new { message = context.Error.Message });
        
        if (context?.Error is UserDeletionNotAllowedException)
            return Conflict(new { message = context.Error.Message });
        
        
        
        // Refresh Token Exceptions
        if (context?.Error is RefreshTokenExpiredException)
            return Unauthorized(new { message = context.Error.Message });

        if (context?.Error is RefreshTokenNotFoundException)
            return NotFound(new { message = context.Error.Message });

        if (context?.Error is RefreshTokenRevokedException)
            return Conflict(new { message = context.Error.Message });
        
        
        // Access Token Exceptions
        if (context?.Error is InvalidAccessTokenException)
            return Unauthorized(new { message = context.Error.Message });

        if (context?.Error is MissingAuthorizationHeaderException)
            return Unauthorized(new { message = context.Error.Message });
      
    
        //  Vehicle Exceptions 
        if (context?.Error is VehicleNotFoundException)
            return NotFound(new { message = context.Error.Message });
        
        if (context?.Error is NoVehiclesFoundException)
            return NotFound(new { message = context.Error.Message });
      
        if (context?.Error is InvalidStatusException)
            return BadRequest(new { message = context.Error.Message });
        
        if(context?.Error is VehicleAlreadyExistsException )
            return Conflict(new { message = context.Error.Message });
        
        if (context?.Error is VehicleStatusUnchangedException)
            return Conflict(new { message = context.Error.Message });
        
        if (context?.Error is VehicleAlreadyAssignedException)
            return Conflict(new { message = context.Error.Message });
        
        
        // Driver Exceptions
        if (context?.Error is DriverNotFoundException)
            return NotFound(new { message = context.Error.Message });
        
        if (context?.Error is NoDriversFoundException)
            return NotFound(new { message = context.Error.Message });
        
        if (context?.Error is DriverStatusUnchangedException)
            return Conflict(new { message = context.Error.Message });
        
        if (context?.Error is DriverAlreadyAssignedException)
            return Conflict(new { message = context.Error.Message });
        
        if (context?.Error is DriverAlreadyExistsException)
            return Conflict(new { message = context.Error.Message });
        
        
        // MaintenanceLog Exception 
        if (context?.Error is MaintenanceLogNotFoundException)
            return NotFound(new { message = context.Error.Message });
        
        if (context?.Error is NoMaintenanceLogFoundException)
            return NotFound(new { message = context.Error.Message });

        if (context?.Error is InvalidMaintenanceLogCostException)
            return BadRequest(new { message = context.Error.Message });
     

        return StatusCode(500, new { message = "An unexpected error occurred." });
    }
}