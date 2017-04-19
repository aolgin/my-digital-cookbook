(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PasswordController", PasswordController);

    function PasswordController(UserService, currentUser, adminUser) {
        var vm = this;
        vm.uid = currentUser._id;
        if (adminUser) {
            vm.admin = true;
        }

        function init() {

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