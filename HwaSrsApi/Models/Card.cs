using System.Collections.Generic;

namespace HwaSrsApi.Models
{
    public class Card
    {
        public int Id { get; set; }

        // TODO remove optional reference (cascade delete hack)
        // write a custom trigger "instead of delete" to handle multipath delete
        // or .OnDelete(DeleteBehavior.ClientCascade)
        public int? CardTypeId { get; set; }
        public virtual CardType CardType { get; set; }

        public int CourseId { get; set; }
        public virtual Course Course { get; set; }

        public CardProgress Progress { get; set; }
        public string ActivationCondition { get; set; }
        public string Tags { get; set; }

        public virtual List<FieldData> Fields { get; set; } = new List<FieldData>();
    }
}
