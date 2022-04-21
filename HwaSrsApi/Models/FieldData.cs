using System.Text.Json.Serialization;

namespace HwaSrsApi.Models
{
    public class FieldData
    {
        public int CardId { get; set; }
        [JsonIgnore]
        public Card Card { get; set; }

        public int FieldId { get; set; }
        [JsonIgnore]
        public Field Field { get; set; }

        public string Value { get; set; }
    }
}
