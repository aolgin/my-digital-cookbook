(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("ErrorController", ErrorController);

    function ErrorController($routeParams, currentUser, UserService, $location, adminUser) {
        var vm = this;
        if (currentUser) {
            vm.uid = currentUser._id;
        }
        if (adminUser) {
            vm.admin = true;
        }
        var code = $routeParams.code;

        function init() {
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
        }
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
                    $location.url("/");
                });
        }
    }
})();