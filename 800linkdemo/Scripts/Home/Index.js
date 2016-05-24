$(function () {
    // mock data for calls list
    var calls = [
        { duration: 900, number: "(231) 555-5555" },
        { duration: 300, number: "(231) 555-5556" }
    ];

    var HomeIndexViewModel = {
        callsList: ko.observableArray(calls),
        formatDuration: function (seconds) {
            // use moment.js to format seconds into something more pretty
            var ms = $.isNumeric(seconds) ? parseInt(seconds, 10) * 1000 : 0;
            return moment.utc(ms).format("HH [hours] mm [minutes] ss [seconds]");
        }
    };

    ko.applyBindings(HomeIndexViewModel, document.getElementById('calls-list'));
});