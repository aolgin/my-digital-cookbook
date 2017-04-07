(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("BookListController", BookListController);

    function BookListController(BookService, $routeParams, UserService) {
        var vm = this;
        vm.userId = $routeParams['uid'];

        function init() {
            var promise = UserService.findBooksByUserId(vm.userId);
            promise.then(function(response) {
                vm.books = response.data;
            });
            promise = UserService.findUserById(vm.userId);
            promise.then(function(response) {
                vm.user = response.data;
            });
        }
        init();
    }
})();