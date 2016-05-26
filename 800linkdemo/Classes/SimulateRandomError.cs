using System;
using System.Web.Mvc;

namespace CallDemo.Classes
{
    /// <summary>
    /// This attribute will randomly throw errors saying cannot connect to server
    /// </summary>
    public class SimulateRandomServerError : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var error = DateTime.Now.Second % 3 == 0 ? true : false;
            if (error)
            {
                var random = new Random();
                var errors = new string[] { "Unable to connecto to server", "Invalid response from server" };
                filterContext.HttpContext.Response.StatusCode = 500;
                filterContext.HttpContext.Response.Write((string)errors[random.Next(errors.Length)]);
            }
        }
    }
}