using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HwaSrsApi.Models
{
    public class CardProgress
    {
        [ForeignKey("Card")]
        public int Id { get; set; }
        public Card Card { get; set; }

        public CardStatus Status { get; set; }
        public DateTime? DueDate { get; set; }
        public TimeSpan? Interval { get; set; }

        public virtual List<CardReview> ReviewHistory { get; set; } = new List<CardReview>();
    }

    public enum CardStatus
    {
        [Display(Name = "Активна")]
        Activated,
        [Display(Name = "Повторение")]
        Reviewing,
        [Display(Name = "Завершена")]
        Completed,
    }
}
