//using System.ComponentModel.DataAnnotations.Schema;

//namespace AdminService.Entities
//{
//    [Table("owners")]
//    public class Owner
//    {
//        public long OwnerId { get; set; }

//        [Column("owner_type")]
//        public string OwnerType { get; set; }

//        [Column("status")]

//        public string Status { get; set; }

//        public string Name { get; set; }

//        public string ContactNo { get; set; }

//        public string Address { get; set; }

//        public string IdCardType { get; set; }

//        public string IdCardNumber { get; set; }

//        public long UserId { get; set; }
//    }
//}



using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Entities
{
    [Table("owners")]
    public class Owner
    {
        [Key]
        [Column("owner_id")] // Matches @Column(name = "owner_id")
        public long OwnerId { get; set; }

        [Column("owner_type")] // Matches @Column(name = "owner_type")
        public string OwnerType { get; set; } // Enums map to strings in your Java setup

        [Column("name")]
        public string Name { get; set; }

        [Column("contact_no")]
        public string ContactNo { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("address")]
        public string Address { get; set; }

        [Column("status")]
        public string Status { get; set; }

        [Column("id_card_type")]
        public string IdCardType { get; set; }

        [Column("id_card_number")]
        public string IdCardNumber { get; set; }

        // Navigation property (Optional, but useful for Joins)
        [ForeignKey("OwnerId")]
        public virtual User User { get; set; }
    }
}