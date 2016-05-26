using CallDemo.Classes;
using System.Web;
using System.Web.Mvc;

namespace CallDemo
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new SimulateRandomServerError());
        }
    }
}
