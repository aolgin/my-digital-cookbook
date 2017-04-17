(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("BookNewController", BookNewController);

    function BookNewController(BookService, $location, $routeParams, currentUser, UserService, $rootScope) {
        var vm = this;
        vm.uid = currentUser._id;

        function init() {

        }
        init();

        vm.createBook = createBook;
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

        function createBook(book) {
            if (!book || !book.name) {
                vm.error = "The 'name' field is required for submission";
                return;
            }
            var promise = BookService.createBook(book, vm.uid);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.uid + "/book");
                }
            }).catch(function (err) {
                var status = err.status;
                if (status == 'Conflict') {
                    vm.error = "A book with this name already exists! Please use a different name!";
                } else {
                    vm.error = "An uncaught error occurred creating your book: \n" + err.data;
                }
            });
        }
    }
})();