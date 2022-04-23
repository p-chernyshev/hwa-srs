using System.Collections.Generic;

namespace HwaSrsApi.Models
{
    public class CourseReviewViewModel
    {
        public int Id { get; set; }
        public List<Card> Due { get; set; }
        public List<Card> New { get; set; }
    }
}
