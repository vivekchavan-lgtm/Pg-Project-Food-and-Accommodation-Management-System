using Microsoft.AspNetCore.Mvc;

namespace AdminService.Models
{
    public class AdminUser
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }   // hashed later
        public string Role { get; set; } = "ADMIN";
    }
}
