using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HwaSrsApi.Models
{
    public class FieldData
    {
        [Key]
        [Column(Order = 1)]
        public int CardId { get; set; }
        public Card Card { get; set; }

        [Key]
        [Column(Order = 2)]
        public int FieldId { get; set; }
        public Field Field { get; set; }

        public string Value { get; set; }
    }
}
