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
using CallDemo.BusinessLayer;
using CallDemo.Classes;

namespace CallDemo.Controllers
{
    public class CallsController : ApiController
    {
        private CallDemoContext db = new CallDemoContext();

        // GET: api/Calls
        [SimulateRandomServerError]
        public IQueryable<CallLog> GetCalls([FromUri] SavedFilter search)
        {
            IQueryable<CallLog> calls = db.Calls;

            // apply search filters 
            var filters = new CallLogFilters(calls);
            calls = filters.ApplyNumber(search.Number);
            calls = filters.ApplyExtension(search.Extension);
            calls = filters.ApplyDuration(search.Duration);
            calls = filters.ApplyDateRange(search.DateAfter, search.DateBefore);

            return calls;
        }

        /* 
         * i removed this for now because it was being hit when a saved filter
         * was used since they have an ID. it wasn't in use anyways
         * 
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
        */

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