(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("RecipeListController", RecipeListController);

    function RecipeListController(RecipeService, currentUser, UserService, adminUser) {
        var vm = this;
        vm.username = currentUser.username;
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