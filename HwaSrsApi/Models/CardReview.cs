using System;
using System.ComponentModel.DataAnnotations;

namespace HwaSrsApi.Models
{
    public class CardReview
    {
        public int Id { get; set; }

        public DateTime DateReviewed { get; set; }

        [Required]
        public int Answer { get; set; }
    }
}
