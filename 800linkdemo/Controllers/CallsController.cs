using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using CallDemo.Models;
using CallDemo.DataLayer;
using CallDemo.Classes;

namespace CallDemo.Controllers
{
    public class FilterSearchDTO
    {
        public string number { get; set; }
        public string ext { get; set; }
        public int? duration { get; set; }
        public DateTime? dateAfter { get; set; }
        public DateTime? dateBefore { get; set; }
    }

    public class CallsController : ApiController
    {
        private CallDemoContext db = new CallDemoContext();

        // GET: api/Calls
        // TODO [SimulateRandomServerError]
        public IQueryable<CallLog> GetCalls([FromUri] FilterSearchDTO search)
        {
            // simulate random server error
            var error = DateTime.Now.Second % 5 == 0 ? true : false;
            if (error)
            {
                var random = new Random();
                var errors = new string[] { "Unable to connecto to server", "Invalid response from server" };
                throw new Exception((string)errors[random.Next(errors.Length)]);
            }

            IQueryable<CallLog> calls = db.Calls;

            // apply search filters
            if (!string.IsNullOrWhiteSpace(search.number))
            {
                calls = calls.Where(c => c.Number.StartsWith(search.number));
            }

            return calls;
        }

        // GET: api/Calls/5
        [ResponseType(typeof(CallLog))]
        public async Task<IHttpActionResult> GetCall(int id)
        {
            CallLog call = await db.Calls.FindAsync(id);
            if (call == null)
            {
                return NotFound();
            }

            return Ok(call);
        }

        // PUT: api/Calls/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutCall(int id, CallLog call)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != call.ID)
            {
                return BadRequest();
            }

            db.Entry(call).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CallExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Calls
        [ResponseType(typeof(CallLog))]
        public async Task<IHttpActionResult> PostCall(CallLog call)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Calls.Add(call);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = call.ID }, call);
        }

        // DELETE: api/Calls/5
        [ResponseType(typeof(CallLog))]
        public async Task<IHttpActionResult> DeleteCall(int id)
        {
            CallLog call = await db.Calls.FindAsync(id);
            if (call == null)
            {
                return NotFound();
            }

            db.Calls.Remove(call);
            await db.SaveChangesAsync();

            return Ok(call);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CallExists(int id)
        {
            return db.Calls.Count(e => e.ID == id) > 0;
        }
    }
}