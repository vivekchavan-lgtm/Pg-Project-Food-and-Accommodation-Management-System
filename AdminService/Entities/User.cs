using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Entities
{
    [Table("users")]
    public class User
    {
        public long Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Mobile { get; set; }

        public string Email { get; set; }

        public string City { get; set; }

        public string Gender { get; set; }

        public string Role { get; set; }

        public bool Enabled { get; set; } = true;
    }
}
