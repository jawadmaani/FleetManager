namespace FleetManager.Repository.QueryResults;

public class VehicleTotalCostResult
{
    public int VehicleId { get; set; }
    public string PlateNumber { get; set; } = null!;
    public decimal TotalCost { get; set; }
}