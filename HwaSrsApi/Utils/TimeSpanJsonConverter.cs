using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace HwaSrsApi.Utils
{
    public class TimeSpanJsonConverter: JsonConverter<TimeSpan?>
    {
        public override TimeSpan? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
            {
                reader.Read();
                return null;
            }

            return TimeSpan.FromMilliseconds(reader.GetDouble());
        }

        public override void Write(Utf8JsonWriter writer, TimeSpan? value, JsonSerializerOptions options)
        {
            if (value is TimeSpan timeSpan)
            {
                writer.WriteNumberValue(timeSpan.TotalMilliseconds);
            }
            else
            {
                writer.WriteNullValue();
            }
        }
    }
}
