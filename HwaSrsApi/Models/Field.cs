using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HwaSrsApi.Models
{
    public class Field
    {
        public int Id { get; set; }
        [MaxLength(64)]
        [Required]
        public string Name { get; set; }

        public int CardTypeId { get; set; }
        [JsonIgnore]
        public virtual CardType CardType { get; set; }
    }
}
