using System;

namespace CallDemo.Models
{
    public class SavedFilter
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
        public string Extension { get; set; }
        public int? Duration { get; set; }
        public DateTime? DateBefore { get; set; }
        public DateTime? DateAfter { get; set; }
    }
}
