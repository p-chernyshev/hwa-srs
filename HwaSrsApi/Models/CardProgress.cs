using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HwaSrsApi.Models
{
    public class CardProgress
    {
        [Key]
        [Column(Order = 1)]
        public int CardId { get; set; }
        public Card Card { get; set; }

        [Key]
        [Column(Order = 2)]
        public int UserId { get; set; }
        public virtual User User { get; set; }

        public CardStatus Status { get; set; }
        public DateTime? DueDate { get; set; }
        public TimeSpan? Interval { get; set; }

        public List<CardReview> ReviewHistory { get; set; }
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
