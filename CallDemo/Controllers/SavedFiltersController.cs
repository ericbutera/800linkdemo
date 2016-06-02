using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using CallDemo.DataLayer;
using CallDemo.Models;

namespace CallDemo.Controllers
{
    public class SavedFiltersController : ApiController
    {
        private CallDemoContext db = new CallDemoContext();

        // GET: api/SavedFilters
        public IQueryable<SavedFilter> GetSavedFilters()
        {
            return db.SavedFilters;
        }

        // GET: api/SavedFilters/5
        [ResponseType(typeof(SavedFilter))]
        public async Task<IHttpActionResult> GetSavedFilter(int id)
        {
            SavedFilter savedFilter = await db.SavedFilters.FindAsync(id);
            if (savedFilter == null)
            {
                return NotFound();
            }

            return Ok(savedFilter);
        }

        // PUT: api/SavedFilters/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutSavedFilter(int id, SavedFilter savedFilter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != savedFilter.ID)
            {
                return BadRequest();
            }

            db.Entry(savedFilter).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SavedFilterExists(id))
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

        // POST: api/SavedFilters
        [ResponseType(typeof(SavedFilter))]
        public async Task<IHttpActionResult> PostSavedFilter(SavedFilter savedFilter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SavedFilters.Add(savedFilter);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = savedFilter.ID }, savedFilter);
        }

        // DELETE: api/SavedFilters/5
        [ResponseType(typeof(SavedFilter))]
        public async Task<IHttpActionResult> DeleteSavedFilter(int id)
        {
            SavedFilter savedFilter = await db.SavedFilters.FindAsync(id);
            if (savedFilter == null)
            {
                return NotFound();
            }

            db.SavedFilters.Remove(savedFilter);
            await db.SaveChangesAsync();

            return Ok(savedFilter);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SavedFilterExists(int id)
        {
            return db.SavedFilters.Count(e => e.ID == id) > 0;
        }
    }
}