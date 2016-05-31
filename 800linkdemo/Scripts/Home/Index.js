$(function () {
    // powers the filter search
    // probably need to change this into a class like ErrorVM - tired of all this
    var CallFiltersViewModel = {
        showFilters: ko.observable(false),
        savedFilters: ko.observableArray(), 
        currentFilter: ko.observable({}), // represents the current filter input values
        selectedSavedFilter: ko.observable(false),
        showSavedFilterName: ko.observable(false), // change this to be a computed instead of hard coding show/hides all over the place
        toggleSearch: function () {
            //TODO #11 isSearchDisabled: ko.observable(false),
            this.showFilters(!this.showFilters());
        },
        resetSearch: function() {
            this.resetSelectedSavedFilter();
            this.currentFilter({});
            this.searchCallList();
            this.showSavedFilterName(false);
        }, 
        resetSelectedSavedFilter: function() {
            this.selectedSavedFilter(undefined); // if this isnt undefined it wont reset the dropdown
        },
        validate: function(filter) {
            // will return filter object if valid, else bool false
            // remove data mask - TODO there has to be a better way to handle this mask
            if (filter.Number) {
                filter.Number = filter.Number.replace(/\D/g, '');
            }

            // validate dates are in order
            if (filter.DateAfter && filter.DateBefore) {
                var dateAfter = moment(filter.DateAfter).toDate()
                    , dateBefore = moment(filter.DateBefore).toDate();

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
        },
        createSavedFilter: function () {
            this.resetSelectedSavedFilter();
            this.currentFilter().ID = null;
            this.showSavedFilterName(true);
        },
        saveSavedFilter: function() {
            // #5
            var filter = this.currentFilter();
            var jsonFilter = JSON.stringify(filter);

            // validate that we have a name and possibly some sort of data
            if (!filter.Name || !filter.Name.length) {
                CallDemo.displayError('Please provide a name before saving');
                return false;
            }

            var updateSavedFilters = function () {
                // update load search dropdown filter.Name property
                var filters = $.map(CallFiltersViewModel.savedFilters(), function (currentFilter) {
                    if (filter.ID == currentFilter.ID) {
                        return filter;
                    }
                    return currentFilter;
                });

                // this isnt working
                /*CallFiltersViewModel.savedFilters.removeAll();
                CallFiltersViewModel.savedFilters(filters);
                CallFiltersViewModel.selectedSavedFilter(CallFiltersViewModel.currentFilter());*/
            };

            if (filter.ID > 0) {
                $.ajax({
                    url: '/api/SavedFilters/' + filter.ID, jsonFilter,
                    type: 'PUT',
                    data: jsonFilter,
                    contentType: 'application/json',
                    success: updateSavedFilters 
                    /*
                    error: function (jqXHR) {
                        // could do custom error handling here to show the server side validation failures from the ModelState
                    }
                    */
                });
            } else {
                $.post('/api/SavedFilters', jsonFilter)
                    .success(updateSavedFilters);
            }
        },
        deleteSavedFilter: function() {
            // #26 todo turn into modal
            if (confirm('Are you sure you wish to delete this filter?')) {
                var self = this;
                var filter = this.currentFilter();
                $.ajax({
                    url: '/api/SavedFilters/' + filter.ID,
                    type: 'DELETE',
                    contentType: 'application/json'
                })
                .success(function () {
                    self.savedFilters.remove(filter);
                    self.resetSelectedSavedFilter();
                    self.currentFilter({});
                });
            }
        }
    };
    CallFiltersViewModel.hasSavedFilters = ko.computed(function () {
        return this.savedFilters().length > 0;
    }, CallFiltersViewModel),

    CallFiltersViewModel.selectedSavedFilter.subscribe(function (newFilter) {
        // if a user selects a predefined filter, update the current filter
        if (newFilter) {
            // c# doesn't have a date type so we have to chop off the time bit to make this fit into the 
            // html5 date picker
            if (newFilter.DateAfter) newFilter.DateAfter = moment(newFilter.DateAfter).utc().format('YYYY-MM-DD');
            if (newFilter.DateBefore) newFilter.DateBefore = moment(newFilter.DateBefore).utc().format('YYYY-MM-DD');
            
            CallFiltersViewModel.currentFilter(newFilter);
        } else {
            // it might be better to not clear the entire thing and only get rid of the ID field 
            CallFiltersViewModel.currentFilter({});
        }
    });
    CallFiltersViewModel.selectedSavedFilter.extend({
        notify: 'always'
    });

    CallFiltersViewModel.currentFilter.subscribe(function (filterValue) {
        if (filterValue.ID) {
            CallFiltersViewModel.showSavedFilterName(true);
        } else {
            // this may cause issues with Actions > Create
            CallFiltersViewModel.showSavedFilterName(false);
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
