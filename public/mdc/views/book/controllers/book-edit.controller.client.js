(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("BookEditController", BookEditController);

    function BookEditController(BookService, $location, $routeParams) {
        var vm = this;
        vm.bookId = $routeParams['bid'];
        vm.userId = $routeParams['uid'];

        function init() {
            var bookPromise = BookService.findBookById(vm.bookId);
            bookPromise.then(function(response) {
                vm.book = response.data;
            });
        }
        init();

        vm.deleteBook = deleteBook;
        vm.updateBook = updateBook;

        function deleteBook() {

            var answer = confirm("Delete this book?");
            if (answer) {
                var promise = BookService.deleteBook(vm.bookId);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url("/user/" + vm.userId + "/book");
                    }
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred deleting your book: \n" + err.data;
                });
            }
        }

        function updateBook(newSite) {
            if (!newSite || !newSite.name) {
                vm.error = "The 'name' field is required for submission";
                return;
            }
            var promise = BookService.updateBook(vm.bookId, newSite);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.userId + "/book");
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