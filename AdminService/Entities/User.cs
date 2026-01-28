//using System.ComponentModel.DataAnnotations.Schema;

//namespace AdminService.Entities
//{
//    [Table("users")]
//    public class User
//    {
//        public long Id { get; set; }

//        public string FirstName { get; set; }

//        public string LastName { get; set; }

//        public string Mobile { get; set; }

//        public string Email { get; set; }

//        public string City { get; set; }

//        public string Gender { get; set; }

//        public string Role { get; set; }

//        public bool Enabled { get; set; } = true;
//    }
//}


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Entities
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; }

        [Column("last_name")]
        public string LastName { get; set; }

        [Column("mobile")]
        public string Mobile { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("password")] // Added since it's in your Spring entity
        public string Password { get; set; }

        [Column("city")]
        public string City { get; set; }

        [Column("gender")]
        public string Gender { get; set; }

        [Column("role")]
        public string Role { get; set; }

        [Column("enabled")]
        public bool Enabled { get; set; } = true;
    }
}