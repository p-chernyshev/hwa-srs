using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HwaSrsApi.Models
{
    public class Course
    {
        public int Id { get; set; }
        [MaxLength(64)]
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }

        public virtual List<Card> Cards { get; set; } = new List<Card>();
    }
}
