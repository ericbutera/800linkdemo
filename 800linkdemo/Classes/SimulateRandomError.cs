using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace CallDemo.Classes
{
    /// <summary>
    /// This attribute will randomly throw errors to show the app can handle errors gracefully
    /// </summary>
    public class SimulateRandomServerError : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var error = DateTime.Now.Second % 5 == 0 ? true : false;
            if (error)
            {
                var random = new Random();
                // maybe make this a dictionary so we can have different status codes that make sense
                var errors = new string[] { "Unable to connect to the server", "Invalid response from server" };
                var offset = random.Next(errors.Length);

                actionContext.Response = actionContext.Request.CreateErrorResponse(
                    HttpStatusCode.InternalServerError,
                    errors[offset]
                );
            }
        }
    }
}