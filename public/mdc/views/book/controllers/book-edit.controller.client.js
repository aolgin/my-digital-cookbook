(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("BookEditController", BookEditController);

    function BookEditController(BookService, $location, $routeParams, currentUser, UserService, adminUser) {
        var vm = this;
        vm.bookId = $routeParams['bid'];
        if (adminUser) {
            vm.admin = true;
        }

        function init() {
            var bookPromise = BookService.findBookById(vm.bookId);
            bookPromise.then(function(response) {
                vm.book = response.data;
                if (!currentUser || currentUser._id !== vm.book._user._id) {
                    $location.url("/error?code=401");
                } else {
                    vm.uid = currentUser._id;
                }
            }, function (err) {
                $location.url("/error?code=404");
            });
        }
        init();

        vm.deleteBook = deleteBook;
        vm.updateBook = updateBook;
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

        function deleteBook() {
            var answer = confirm("Delete this book?");
            if (answer) {
                var promise = BookService.deleteBook(vm.bookId);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url("/dashboard/books");
                    }
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred deleting your book: \n" + err.data;
                });
            }
        }

        function updateBook(newBook) {
            if (!newBook || !newBook.name) {
                vm.error = "The 'name' field is required for submission";
                return;
            }
            var promise = BookService.updateBook(vm.bookId, newBook);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/cookbook/" + vm.bookId);
                }
            }).catch(function(err) {
                var status = err.status;
                if (status == 409) {
                    vm.error = "A book with that name already exists! Please use a different name.";
                } else {
                    vm.error = "An uncaught error occurred when updating your book: \n" + err.data;
                }
            });
        }
    }
})();