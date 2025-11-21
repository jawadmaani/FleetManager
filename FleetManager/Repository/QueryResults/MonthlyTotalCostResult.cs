namespace FleetManager.Repository.QueryResults;

public class MonthlyTotalCostResult
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal TotalCost { get; set; }
}