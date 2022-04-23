using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using HwaSrsApi.Utils;

namespace HwaSrsApi.Models
{
    public class CardProgress
    {
        [ForeignKey("Card")]
        public int Id { get; set; }
        [JsonIgnore]
        public Card Card { get; set; }

        public CardStatus Status { get; set; }
        public DateTime? DueDate { get; set; }
        [JsonConverter(typeof(TimeSpanJsonConverter))]
        public TimeSpan? Interval { get; set; }

        public virtual List<CardReview> ReviewHistory { get; set; } = new List<CardReview>();
    }

    public enum CardStatus
    {
        [Display(Name = "Активна")]
        Activated = 1,
        [Display(Name = "Повторение")]
        Reviewing = 2,
        [Display(Name = "Завершена")]
        Completed = 3,
    }
}
