using System;
using System.Collections.Generic;
using System.Linq;
using CallDemo.Models;

namespace CallDemo.BusinessLayer
{
    public class CallLogFilters
    {
        private IQueryable<CallLog> _calls { get; set; }

        public CallLogFilters(IQueryable<CallLog> calls)
        {
            _calls = calls;
        }

        /// <summary>
        /// Filters the result set to only show calls that start with this phone number
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public IQueryable<CallLog> ApplyNumber(string number)
        {
            // if I were to write this in raw SQL I'd use SELECT cols FROM CallLog WHERE [Number] LIKE @searchNumber + '%'
            if (!string.IsNullOrWhiteSpace(number))
                _calls = _calls.Where(c => c.Number.StartsWith(number));

            return _calls;
        }

        /// <summary>
        /// Filters the result set to only show calls that start with this extension
        /// </summary>
        /// <param name="ext"></param>
        /// <returns></returns>
        public IQueryable<CallLog> ApplyExtension(string ext)
        {
            if (!string.IsNullOrWhiteSpace(ext))
                _calls = _calls.Where(c => c.Extension.StartsWith(ext));

            return _calls;
        }

        /// <summary>
        /// Filters the result set to only show calls that equal or exceed this duration in minutes
        /// </summary>
        /// <param name="duration"></param>
        /// <returns></returns>
        public IQueryable<CallLog> ApplyDuration(int? duration)
        {
            if (duration != null && duration > 0)
                _calls = _calls.Where(c => c.Duration >= (duration * 60));

            return _calls;
        }

        /// <summary>
        /// Filters the result set to only show calls that are within the specified date range.
        ///
        /// If only dateAfter is provided, then it will show calls greater than or equal to dateAfter.
        /// If only dateBefore is provided, then it will show calls less than or equal to dateBefore.
        /// </summary>
        /// <param name="dateAfter"></param>
        /// <param name="dateBefore"></param>
        /// <returns></returns>
        public IQueryable<CallLog> ApplyDateRange(DateTime? dateAfter, DateTime? dateBefore)
        {
            if (dateBefore != null)
            {
                // if we have a date before, we need to make sure its the last second of the requested day as the default 
                // is midnight and would exclude the requested value
                dateBefore = dateBefore.Value.Add(new TimeSpan(23, 59, 59));
            }

            if (dateAfter != null && dateBefore != null)
            {
                // filter based on requested date between dateAfter and dateBefore
                _calls = _calls.Where(c => c.DateCalled >= dateAfter && c.DateCalled <= dateBefore);
            }
            else if (dateAfter != null)
            {
                // filter based on requested date is greater or equal to dateAfter
                _calls = _calls.Where(c => c.DateCalled >= dateAfter);
            }
            else if (dateBefore != null)
            {
                // filter based on requested date is less than or equal to dateBefore
                _calls = _calls.Where(c => c.DateCalled <= dateBefore);
            }

            return _calls;
        }

    }
}