(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("ErrorController", ErrorController);

    function ErrorController($routeParams, currentUser, UserService, $rootScope, $location) {
        var vm = this;
        if (currentUser) {
            vm.uid = currentUser._id;
        }
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

        vm.search = search;
        vm.logout = logout;

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/");
                });
        }
    }
})();