using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Entities
{
    [Table("owners")]
    public class Owner
    {
        public long OwnerId { get; set; }

        [Column("owner_type")]
        public string OwnerType { get; set; }

        [Column("status")]

        public string Status { get; set; }

        public string Name { get; set; }

        public string ContactNo { get; set; }

        public string Address { get; set; }

        public string IdCardType { get; set; }

        public string IdCardNumber { get; set; }

        public long UserId { get; set; }
    }
}
