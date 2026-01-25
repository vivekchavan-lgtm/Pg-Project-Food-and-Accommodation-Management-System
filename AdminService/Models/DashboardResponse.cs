namespace AdminService.Models
{
    public class DashboardResponse
    {
        public long TotalOwners { get; set; }
        public long PendingOwners { get; set; }

        public long TotalPGs { get; set; }
        public long PendingPGs { get; set; }

        public long TotalMess { get; set; }
        public long PendingMess { get; set; }
    }
}
