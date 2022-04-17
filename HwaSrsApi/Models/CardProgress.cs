using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace HwaSrsApi.Models
{
    [Owned]
    public class CardProgress
    {
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
