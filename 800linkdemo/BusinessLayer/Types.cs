using System;

namespace CallDemo.BusinessLayer
{
    public class Types
    {
    }

    public class FilterSearchDTO
    {
        public string number { get; set; }
        public string ext { get; set; }
        public int? duration { get; set; }
        public DateTime? dateAfter { get; set; }
        public DateTime? dateBefore { get; set; }
    }


}