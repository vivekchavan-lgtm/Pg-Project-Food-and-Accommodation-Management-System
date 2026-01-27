using AdminService.DTO;
using AdminService.Entities;

namespace AdminService.Services.Interfaces
{
    public interface IAdminService
    {
        IEnumerable<User> GetAllUsers();

        IEnumerable<Owner> GetAllOwners();

        IEnumerable<Owner> GetPendingOwners();

        Owner ApproveOwner(long ownerId);

        Owner RejectOwner(long ownerId);

        User DisableUser(long userId);

        void  DeleteUser(long userId);
        AdminStatsDto GetDashboardStats();

    }
}
