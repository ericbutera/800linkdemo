$(function () {

    // powers the filter search
    var CallFiltersViewModel = {
        showFilters: ko.observable(false),
        currentFilter: ko.observable({}), // represents the current filter input values
        toggleSearch: function () {
            var currentState = this.showFilters();
            this.showFilters(~currentState);
        },
        searchCallList: function () {
            console.log(arguments);
            console.log('filter %o', ko.toJSON(CallFiltersViewModel.currentFilter()));
            debugger;
            // CallFiltersViewModel.fetchData(CallFiltersViewModel.currentFilter());
        }
    };
    ko.applyBindings(CallFiltersViewModel, document.getElementById('call-filters'));


    // mock data for calls list 
    // TODO: move to WebApi
    var calls = [
        { duration: 900, number: '(231) 555-5555', extension: '123' },
        { duration: 600, number: '(231) 555-5556' },
        { duration: 300, number: '(231) 555-5557', extension: '3476' }
    ];

    // powers the calls list grid
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
    };
    ko.applyBindings(CallsListViewModel, document.getElementById('calls-list'));
    CallsListViewModel.fetchData(CallFiltersViewModel.currentFilter());

});