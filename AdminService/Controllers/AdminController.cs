using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AdminService.Data;
using AdminService.Models;
using AdminService.Utils;
using System.Linq;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminDbContext _db;
        private readonly JwtService _jwtService;

        public AdminController(AdminDbContext db, JwtService jwtService)
        {
            _db = db;
            _jwtService = jwtService;
        }

        
        // ADMIN LOGIN (PUBLIC)
        
        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginRequest request)
        {
            var admin = _db.AdminUsers
                .FirstOrDefault(a => a.Email == request.Email);

            if (admin == null || admin.Password != request.Password)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Generate JWT
            var token = _jwtService.GenerateToken(admin.Email, admin.Role);

            return Ok(new
            {
                message = "Login successful",
                email = admin.Email,
                role = admin.Role,
                token = token
            });
        }


        
        // HEALTH CHECK 
        
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok("Admin API is running");
        }
    }
}