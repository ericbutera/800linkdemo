using System;
using System.Collections.Generic;
using CallDemo.Models;

namespace CallDemo.DataLayer
{
    public class CallDemoInitializer : System.Data.Entity.DropCreateDatabaseAlways<CallDemoContext>
    {
        protected override void Seed(CallDemoContext context)
        {
            // i couldn't get this working right so i commented it out in web config
            var calls = new List<CallLog>
            {
                new CallLog{Duration=987, Number="2315555555", Extension="123", DateCalled=DateTime.Parse("2016/05/23 08:15:22")},
                new CallLog{Duration=987, Number="2315555556", DateCalled=DateTime.Parse("2016/05/23 13:32:12")},
                new CallLog{Duration=987, Number="2315555557", Extension="3476", DateCalled=DateTime.Parse("2016/05/24 10:49:31")},
                new CallLog{Duration=987, Number="2315555558", DateCalled=DateTime.Parse("2016/05/24 15:01:05")},
            };

            calls.ForEach(s => context.Calls.Add(s));
            context.SaveChanges();
        }
    }
}