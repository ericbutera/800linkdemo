using System;
using System.Data.Entity;

namespace CallDemo.Models
{
    public class CallLog
    {
        public int ID { get; set; }
        public int Duration { get; set; }
        public string Number { get; set; }
        public string Extension { get; set; }
        public DateTime DateCalled { get; set; }
    }
}