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


    // powers the calls list grid
    var CallListViewModel = {
        callsList: ko.observableArray([]),
        fetchData: function() {
            // mock data for calls list
            var calls = [
                { duration: 900, number: "(231) 555-5555" },
                { duration: 600, number: "(231) 555-5556" },
                { duration: 300, number: "(231) 555-5557" }
            ];
        },
        formatDuration: function (seconds) {
            // use moment.js to format seconds into something more pretty
            var ms = $.isNumeric(seconds) ? parseInt(seconds, 10) * 1000 : 0;
            return moment.utc(ms).format("HH [hours] mm [minutes] ss [seconds]");
        },
    };
    CallListViewModel.fetchData(CallFiltersViewModel.currentFilter());
    ko.applyBindings(CallListViewModel, document.getElementById('call-list'));

});