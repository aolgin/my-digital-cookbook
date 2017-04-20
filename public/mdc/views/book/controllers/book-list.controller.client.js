(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("BookListController", BookListController);

    function BookListController(BookService, $routeParams, UserService, adminUser, $location) {
        var vm = this;
        vm.uid = $routeParams['uid'];
        if (adminUser) {
            vm.admin = true;
        }

        function init() {
            var promise = UserService.findBooksByUserId(vm.uid);
            promise.then(function(response) {
                vm.books = response.data;
            });
            promise = UserService.findUserById(vm.uid);
            promise.then(function(response) {
                vm.user = response.data;
                vm.username = vm.user.username;
            });
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