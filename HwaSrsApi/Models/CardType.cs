using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HwaSrsApi.Models
{
    public class CardType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool ReadOnce { get; set; }
        [Required]
        public string Design { get; set; }

        public virtual List<Field> Fields { get; set; }
    }
}
