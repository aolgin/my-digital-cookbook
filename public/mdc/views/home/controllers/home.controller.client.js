(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("HomeController", HomeController);

    function HomeController(currentUser, adminUser, $location, UserService, $route) {
        var vm = this;


        function init() {
            if (currentUser) {
                vm.uid = currentUser._id;
                vm.username = currentUser.username;
            }
            if (adminUser) {
                vm.admin = true;
            }
        }
        init();

        vm.blah = "Yes";
        vm.search = search;
        vm.logout = logout;

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $route.reload();
                });
        }
    }
})();