using AdminService.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
            => Ok(_adminService.GetAllUsers());

        [HttpGet("owners")]
        public IActionResult GetOwners()
            => Ok(_adminService.GetAllOwners());

        [HttpGet("owners/pending")]
        public IActionResult GetPendingOwners()
            => Ok(_adminService.GetPendingOwners());

        [HttpPut("owners/{id}/approve")]
        public IActionResult ApproveOwner(long id)
            => Ok(_adminService.ApproveOwner(id));

        [HttpPut("owners/{id}/reject")]
        public IActionResult RejectOwner(long id)
            => Ok(_adminService.RejectOwner(id));

        [HttpDelete("users/{id}")]
        public IActionResult DeleteUser(long id)
        {
            _adminService.DeleteUser(id);
            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPut("users/{id}/disable")]
        public IActionResult DisableUser(long id)
            => Ok(_adminService.DisableUser(id));

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            return Ok(_adminService.GetDashboardStats());
        }

    }
}
