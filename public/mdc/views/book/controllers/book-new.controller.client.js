(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("BookNewController", BookNewController);

    function BookNewController(BookService, $location, currentUser, UserService, adminUser) {
        var vm = this;
        if (adminUser) {
            vm.admin = true;
        }

        function init() {
            if (!currentUser) {
                $location.url("/error?code=401");
            } else {
                vm.uid = currentUser._id;
                vm.username = currentUser.username;
            }
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
                    $location.url("/dashboard/books");
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