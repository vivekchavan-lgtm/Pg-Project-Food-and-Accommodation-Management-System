namespace AdminService.DTO
{
    public class AdminStatsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int PendingOwners { get; set; }
        public int ApprovedOwners { get; set; }
        public int PgOwners { get; set; }
        public int MessOwners { get; set; }
    }
}
