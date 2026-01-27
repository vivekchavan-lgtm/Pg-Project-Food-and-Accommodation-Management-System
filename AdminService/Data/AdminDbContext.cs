using AdminService.Entities;
using Microsoft.EntityFrameworkCore;

namespace AdminService.Data
{
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Owner> Owners => Set<Owner>();
    }
}
