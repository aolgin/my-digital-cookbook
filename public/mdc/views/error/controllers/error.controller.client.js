(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("ErrorController", ErrorController);

    function ErrorController($routeParams) {
        var vm = this;
        var code = $routeParams.code;
        switch (code) {
            case '401':
                vm.error = "You are not authorized to view this content.";
                break;
            case '404':
                vm.error = 'We are unable to find the page you requested. We apologize for any inconvenience';
                break;
            case '500':
                vm.error = "There was an issue with our servers. We apologize for any inconvenience.";
                break;
            default:
                vm.error = "An unexpected error has occurred. We apologize for any inconvenience.";
                break;
        }

        function init() {}
        init();
    }
})();