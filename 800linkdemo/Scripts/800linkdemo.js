// http://knockoutjs.com/documentation/custom-bindings-controlling-descendant-bindings.html
// in case i want to nest view models
ko.bindingHandlers.allowBindings = {
    init: function (elem, valueAccessor) {
        // Let bindings proceed as normal *only if* my value is false
        var shouldAllowBindings = ko.unwrap(valueAccessor());
        return { controlsDescendantBindings: !shouldAllowBindings };
    }
};


// setup global jquery ajax settings
(function ($) {
    $.ajaxSetup({
        contentType: 'application/json',
        error: function (jqXHR, status, errorThrown) {
            alert('There was an error with the request: ' + settings.url);
        }
    });
})(jQuery);
