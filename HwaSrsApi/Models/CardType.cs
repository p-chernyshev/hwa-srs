using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HwaSrsApi.Models
{
    public class CardType
    {
        public int Id { get; set; }
        [MaxLength(64)]
        [Required]
        public string Name { get; set; }
        public bool ReadOnce { get; set; }
        [Required]
        public string Design { get; set; }

        public virtual List<Card> Cards { get; set; } = new List<Card>();
        public virtual List<Field> Fields { get; set; } = new List<Field>();
    }
}
