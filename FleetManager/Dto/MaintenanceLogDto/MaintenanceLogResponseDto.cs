namespace FleetManager.Dto.MaintenanceLogDto;

public class MaintenanceLogResponseDto
{
    public int Id { get; set; }
    public string MaintenanceType { get; set; }= null!;
    public DateTime MaintenanceDate { get; set; }
    public decimal Cost { get; set; }
    public string? Description { get; set; }
    public string PerformedBy { get; set; }= null!;
    public int VehicleId { get; set; }
    public int CreatedByUserId { get; set; }
    
    public DateTime CreatedAt { get; set; }

}