(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("RecipeListController", RecipeListController);

    function RecipeListController(RecipeService, currentUser, UserService, $rootScope) {
        var vm = this;
        vm.uid = currentUser._id;

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
                    $rootScope.currentUser = null;
                    $location.url("/");
                });
        }
    }
})();