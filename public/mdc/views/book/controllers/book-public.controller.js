(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PublicBookController", PublicBookController);

    function PublicBookController(BookService, $routeParams, $location, currentUser) {
        var vm = this;
        vm.bid = $routeParams['bid'];
        if (currentUser) {
            vm.user = currentUser;
        }

        function init() {
            BookService.findBookById(vm.bid)
                .then(function (response) {
                    vm.book = response.data;
                }, function (err) {
                    console.log(err);
                    $location.url("/error?code=404");
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "An error occurred finding this cookbook. We apologize for any inconvenience";
                });
        }
        init();

    }
})();