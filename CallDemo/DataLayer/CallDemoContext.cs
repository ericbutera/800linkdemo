using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using CallDemo.Models;

namespace CallDemo.DataLayer
{
    public class CallDemoContext : DbContext
    {
        public CallDemoContext() : base("CallDemoContext")
        {
        }

        public DbSet<CallLog> Calls { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

        public System.Data.Entity.DbSet<CallDemo.Models.SavedFilter> SavedFilters { get; set; }
    }
}
