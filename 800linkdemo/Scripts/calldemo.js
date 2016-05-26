// global utility functions
CallDemo = {
    ViewModels: {},
    displayError: function (errorMessage) {
        debugger;
        // todo make this a modal
        
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


// dont pollute the global namespace 
(function ($) {

    // setup global jquery ajax settings
    $.ajaxSetup({
        global: false,
        contentType: 'application/json',
        error: function (jqXhr, status, errorThrown) {
            // make this bullet proof
            var statusCode = jqXhr.statusCode ? jqXhr.statusCode() : false;
            var message = statusCode && statusCode.responseText ? statusCode.responseText : false;
            var exceptionMessageJson = message && message.ExceptionMessage ? message.ExceptionMessage : false;
            var message = exceptionMessageJson ? JSON.parse(exceptionMessageJson) : 'There was an error fetching the call list data. Please try again';
            CallDemo.Errors.add(message);
        }
    });

    // wait for document load
    $(function () {
        // apply input masks
        $(':input').inputmask();
        // unmaskedvalue TODO: we can use something like this to get rid of the mask before sending it to the server

        // powers the error modal view model
        function ErrorVM() {
            var self = this;

            this.elModal = $('#calldemo-error-modal');

            $(this.elModal).on('hide.bs.modal', function (ev) {
                self.close();
            });
        };
        ErrorVM.prototype = {
            errors: ko.observableArray(),
            add: function (error) {
                // accepts an array or string
                if ($.isArray(error)) {
                    var currentErrors = this.errors();
                    this.errors(currentErrors.concat(error));
                } else {
                    this.errors.push(error);
                }
                this.elModal.modal('show');
            },
            close: function () {
                this.errors([]);
            }
        };
        var errorVM = new ErrorVM();
        
        ko.applyBindings(errorVM, document.getElementById('calldemo-errors'));
        CallDemo.Errors = errorVM;
    });
})(jQuery);
