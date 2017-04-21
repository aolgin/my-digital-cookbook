(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("HomeController", HomeController);

    function HomeController(currentUser, adminUser, $location, UserService) {
        var vm = this;
        // vm.uid = currentUser._id;

        function init() {
            // console.log(vm.uid);
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
                    $location.url("/");
                });
        }
    }
})();