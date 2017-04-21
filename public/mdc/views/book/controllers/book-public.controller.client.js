(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PublicBookController", PublicBookController);

    function PublicBookController(BookService, $routeParams, $location, currentUser, UserService, $rootScope) {
        var vm = this;
        vm.bid = $routeParams['bid'];
        if (currentUser) {
            vm.uid = currentUser._id;
        }

        function init() {
            BookService.findBookById(vm.bid)
                .then(function (response) {
                    vm.book = response.data;
                    isYourBook();
                }, function (err) {
                    console.log(err);
                    $location.url("/error?code=404");
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "An error occurred finding this cookbook. We apologize for any inconvenience";
                    vm.yourBook = false;
                });
        }
        init();

        vm.search = search;
        vm.logout = logout;

        function isYourBook() {
            if (currentUser && currentUser._id === vm.book._user._id) {
                vm.yourBook = true;
            } else {
                vm.yourBook = false;
            }
        }

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