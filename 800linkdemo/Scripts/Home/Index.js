$(function () {
    // powers the filter search
    var CallFiltersViewModel = {
        showFilters: ko.observable(false),
        currentFilter: ko.observable({}), // represents the current filter input values
        //TODO #11 isSearchDisabled: ko.observable(false),
        toggleSearch: function () {
            this.showFilters(!this.showFilters());
        },
        validate: function(filter) {
            // will return filter object if valid, else bool false
            // remove data mask - TODO there has to be a better way to handle this mask
            if (filter.number) {
                filter.number = filter.number.replace(/\D/g, '');
            }

            // validate dates are in order
            if (filter.dateAfter && filter.dateBefore) {
                var dateAfter = moment(filter.dateAfter).toDate()
                    , dateBefore = moment(filter.dateBefore).toDate();

                if (dateAfter && dateBefore) {
                    if (dateAfter > dateBefore) {
                        CallDemo.Errors.add('Calls Date After must be less than the value of Calls Date Before.')
                        return false;
                    }
                }
            }

            return filter;
        },
        searchCallList: function () {
            var filter = CallFiltersViewModel.currentFilter()
                , allowSearch = CallFiltersViewModel.validate(filter);

            // TODO #11 CallFiltersViewModel.isSearchDisabled(!allowSearch);
            if (allowSearch) {
                CallsListViewModel.fetchData(filter);
            }
        }
    };
    ko.applyBindings(CallFiltersViewModel, document.getElementById('call-filters'));

    // powers the calls list grid
    // might be time to turn this into a function so i can mess with the prototype instead of the hasCalls stuff below
    var CallsListViewModel = {
        callsList: ko.observableArray([]), 
        fetchData: $.debounce(250, function(currentFilter) {
            currentFilter = currentFilter || {};
            
            $.get('/api/Calls', $.param(currentFilter))
            .success(function (data, status) {
                if (!data || data.error) {
                    return false;
                }

                CallsListViewModel.callsList(data); // use this when webapi implemented
            });
        }),
        refresh: function() {
            var filter = CallFiltersViewModel.currentFilter();
            filter = CallFiltersViewModel.validate(filter);
            if (filter) {
                CallsListViewModel.fetchData(filter);
            }
            return false;
        },
        formatDuration: function (seconds) {
            // use moment.js to format seconds into something more pretty
            var ms = $.isNumeric(seconds) ? parseInt(seconds, 10) * 1000 : 0;
            return moment.utc(ms).format('HH [hours] mm [minutes] ss [seconds]');
        },
        formatDateTime: function (callDate) {
            return callDate ? moment.utc(callDate).format('MM/DD/YYYY hh:mm:ss a') : '';
        },
        formatPhone: function (phone) {
            return '(' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 4);
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

    // using exports is better, but this is sufficient for a demo
    // i put this here because i like to prototype with the console. in other single page apps the js router 
    // can take care of clearing out the viewmodels so that the memory footprint doesn't get too large
    CallDemo.ViewModels = {
        CallsFiltersViewModel: CallFiltersViewModel,
        CallsListViewModel: CallsListViewModel 
    };
});
