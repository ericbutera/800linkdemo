// global utility functions
CallDemo = {
    displayError: function (errorMessage) {
        // todo make this a modal
        alert(errorMessage);
    }
};


// custom knockout bindings
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
            CallDemo.displayError('There was an error with the request: ' + settings.url);
        }
    });

    $(function () {
        $(':input').inputmask();
    });

})(jQuery);
