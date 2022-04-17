namespace HwaSrsApi.Models
{
    public class FieldData
    {
        public int CardId { get; set; }
        public Card Card { get; set; }

        public int FieldId { get; set; }
        public Field Field { get; set; }

        public string Value { get; set; }
    }
}
