using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HwaSrsApi.Models
{
    public class CardReview
    {
        public int Id { get; set; }

        public DateTime DateReviewed { get; set; }

        [Required]
        public int Answer { get; set; }

        [ForeignKey("CardProgress")]
        public int CardId { get; set; }
        [JsonIgnore]
        public virtual CardProgress CardProgress { get; set; }
    }
}
