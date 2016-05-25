$(function () {
    // powers the filter search
    var CallFiltersViewModel = {
        showFilters: ko.observable(false),
        currentFilter: ko.observable({}), // represents the current filter input values
        //TODO #11 isSearchDisabled: ko.observable(false),
        toggleSearch: function () {
            var currentState = this.showFilters();
            this.showFilters(~currentState);
        },
        validate: function(filter) {
            // validate dates are in order
            if (filter.dateAfter && filter.dateBefore) {
                var dateAfter = moment(filter.dateAfter).toDate()
                    , dateBefore = moment(filter.DateBefore).toDate();

                if (dateAfter && dateBefore) {
                    if (dateAfter > dateBefore) {
                        _800LinkDemo.displayError('Calls Date After must be less than the value of Calls Date Before.');
                        return false;
                    }
                }
            }
            return true;
        },
        searchCallList: function () {
            var filter = CallFiltersViewModel.currentFilter();

            if (filter.callerNumber) {
                // remove data mask - TODO there has to be a better way to handle this mask
                filter.callerNumber = filter.callerNumber.replace(/\D/g, '');
            }

            var allowSearch = CallFiltersViewModel.validate(filter);
            // TODO #11 CallFiltersViewModel.isSearchDisabled(!allowSearch);
            if (allowSearch) {
                CallsListViewModel.fetchData(filter);
            }
        }
    };
    ko.applyBindings(CallFiltersViewModel, document.getElementById('call-filters'));


    // mock data for calls list 
    // TODO: move to WebApi
    var calls = [
        { duration: 987, number: '(231) 555-5555', extension: '123', 'dateCalled': new Date('2016/05/23 08:15:22') },
        { duration: 654, number: '(231) 555-5556', extension: '', 'dateCalled': new Date('2016/05/23 13:32:12') },
        { duration: 321, number: '(231) 555-5557', extension: '3476', 'dateCalled': new Date('2016/05/24 10:49:31') },
        { duration: 210, number: '(231) 555-5558', extension: '', 'dateCalled': new Date('2016/05/24 15:01:05') }
    ];

    // powers the calls list grid
    // might be time to turn this into a function so i can mess with the prototype instead of the hasCalls stuff below
    var CallsListViewModel = {
        callsList: ko.observableArray([]), 
        fetchData: $.debounce(250, function(currentFilter) {
            console.log('fetchData called with filter %o', ko.toJSON(currentFilter));
            currentFilter = currentFilter || {};
            
            /*
            $.get('/api/calls/list')
            .success(function (data, status) {
                debugger;
                if (!data || data.error) {
                    return false;
                }

                // CallsListViewModel.callsList(data); // use this when webapi implemented
            });
            */

            CallsListViewModel.callsList(calls); // for now use mocked data
        }),
        formatDuration: function (seconds) {
            // use moment.js to format seconds into something more pretty
            var ms = $.isNumeric(seconds) ? parseInt(seconds, 10) * 1000 : 0;
            return moment.utc(ms).format('HH [hours] mm [minutes] ss [seconds]');
        },
        formatDateTime: function (callDate) {
            return callDate ? moment.utc(callDate).format('MM/DD/YYYY hh:mm:ss a') : '';
        }
    };
    CallsListViewModel.hasCalls = ko.computed(function () {
        return CallsListViewModel.callsList().length;
    });
    CallsListViewModel.noCalls = ko.computed(function () {
        return !CallsListViewModel.callsList().length;
    });

    ko.applyBindings(CallsListViewModel, document.getElementById('calls-list'));
    CallsListViewModel.fetchData(CallFiltersViewModel.currentFilter());

});