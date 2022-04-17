using System.ComponentModel.DataAnnotations;

namespace HwaSrsApi.Models
{
    public class Field
    {
        public int Id { get; set; }
        [MaxLength(64)]
        [Required]
        public string Name { get; set; }

        public int CardTypeId { get; set; }
        public virtual CardType CardType { get; set; }
    }
}
