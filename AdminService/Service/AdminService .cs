using AdminService.Data;
using AdminService.DTO;
using AdminService.Entities;
using AdminService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AdminService.Services
{
    public class AdminService : IAdminService
    {
        private readonly AdminDbContext _context;

        public AdminService(AdminDbContext context)
        {
            _context = context;
        }

        // ---------------- USERS ----------------

        public IEnumerable<User> GetAllUsers()
        {
            //return _context.Users.ToList();
            return _context.Users.Where(u => u.Enabled == true).ToList();
        }

        //public void DeleteUser(long id)
        //{
        //    var user = _context.Users.Find(id)
        //        ?? throw new Exception("User not found");

        //    //_context.Users.Remove(user);
        //    //_context.SaveChanges();
        //    var owner = _context.Owners.FirstOrDefault(o => o.OwnerId == id);
        //    if (owner != null)
        //    {
        //        _context.Owners.Remove(owner);
        //    }

        //    //  remove the User (The Parent)
        //    _context.Users.Remove(user);

        //    // Save everything in one transaction
        //    _context.SaveChanges();
        //}
        public void DeleteUser(long id)
        {
            // 1. Find the User
            var user = _context.Users.Find(id)
                       ?? throw new Exception("User not found");

            // 2. SOFT DELETE: Just flip the flag
            // This avoids all Foreign Key "Child" record errors
            user.Enabled = false;

            // 3. Save the update
            _context.SaveChanges();
        }

        public User DisableUser(long id)
        {
            var user = _context.Users.Find(id)
                ?? throw new Exception("User not found");

            user.Enabled = false;

            _context.SaveChanges();
            return user;
        }

        // ---------------- OWNERS ----------------

        public IEnumerable<Owner> GetAllOwners()
        {
            return _context.Owners.ToList();
        }

        public IEnumerable<Owner> GetPendingOwners()
        {
            return _context.Owners
                .Where(o => o.Status == "PENDING")
                .ToList();
        }

        public Owner ApproveOwner(long id)
        {
            var owner = _context.Owners.Find(id)
                ?? throw new Exception("Owner not found");

            //owner.Status = "APPROVED";
            owner.Status = "ACTIVE";
            _context.SaveChanges();
            return owner;
        }

        public Owner RejectOwner(long id)
        {
            var owner = _context.Owners.Find(id)
                ?? throw new Exception("Owner not found");

            //owner.Status = "REJECTED";
            owner.Status = "INACTIVE";
            _context.SaveChanges();
            return owner;
        }
        public AdminStatsDto GetDashboardStats()
        {
            return new AdminStatsDto
            {
                TotalUsers = _context.Users.Count(),
                ActiveUsers = _context.Users.Count(u => u.Enabled),
                PendingOwners = _context.Owners.Count(o => o.Status == "PENDING"),
                //ApprovedOwners = _context.Owners.Count(o => o.Status == "APPROVED"),
                ApprovedOwners = _context.Owners.Count(o => o.Status == "ACTIVE"),

                PgOwners = _context.Owners.Count(o => o.OwnerType == "PG"),
                MessOwners = _context.Owners.Count(o => o.OwnerType == "MESS")
            };
        }

    }
}
