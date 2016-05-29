﻿$(function () {
    // powers the filter search
    // probably need to change this into a class like ErrorVM - tired of all this
    var CallFiltersViewModel = {
        showFilters: ko.observable(false),
        savedFilters: ko.observableArray(), 
        currentFilter: ko.observable({}), // represents the current filter input values
        selectedSavedFilter: ko.observable(false),
        toggleSearch: function () {
            //TODO #11 isSearchDisabled: ko.observable(false),
            this.showFilters(!this.showFilters());
        },
        resetSearch: function() {
            this.currentFilter({});
            this.searchCallList();
        },
        saveSearch: function() {
            // #5
            var filter = this.currentFilter();
            var jsonFilter = JSON.stringify(filter);

            if (filter.ID > 0) {
                // put
                $.put('/api/SavedFilters/' + filter.ID, jsonFilter)
                .success(function (result) {
                });
            } else {
                // post
                $.post('/api/SavedFilters', jsonFilter)
            }
        },
        deleteSearch: function() {
            // todo turn into modal #26
            if (confirm('Are you sure you wish to delete this filter?')) {
                CallDemo.displayError('Not implemented');
            }
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
                        CallDemo.Errors.add1('Calls Date After must be less than the value of Calls Date Before.')
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
        },
        loadSavedFilters: function() {
            $.get("/api/SavedFilters")
            .success(function (data, status) {
                if (data && $.isArray(data)) { 
                    CallFiltersViewModel.savedFilters(data);
                }
            });
        }
    };
    CallFiltersViewModel.hasSavedFilters = ko.computed(function () {
        return this.savedFilters().length > 0;
    }, CallFiltersViewModel),

    CallFiltersViewModel.selectedSavedFilter.subscribe(function (newFilter) {
        // if a user selects a predefined filter, update the current filter
        console.log('selected filter changed %o', newFilter);
        if (newFilter) {
            CallFiltersViewModel.currentFilter(newFilter);
        }
    });

    ko.applyBindings(CallFiltersViewModel, document.getElementById('call-filters'));
    CallFiltersViewModel.loadSavedFilters();

    // powers the calls list grid
    // might be time to turn this into a function so i can mess with the prototype instead of the hasCalls stuff below
    var CallsListViewModel = {
        callsList: ko.observableArray([]), 
        fetchData: $.debounce(250, function(currentFilter) {
            currentFilter = currentFilter || {};
            
            $.get('/api/Calls', $.param(currentFilter))
            .success(function (data, status) {
                if (!data || data.error) {
                    return CallDemo.displayError(data.error);
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
            return moment.utc(ms).format('HH [hr] mm [min] ss [sec]');
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
