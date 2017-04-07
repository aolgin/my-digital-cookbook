(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("BookNewController", BookNewController);

    function BookNewController(BookService, $location, $routeParams) {
        var vm = this;
        vm.userId = $routeParams['uid'];

        function init() {

        }
        init();

        vm.createBook = createBook;

        function createBook(book) {
            if (!book || !book.name) {
                vm.error = "The 'name' field is required for submission";
                return;
            }
            var promise = BookService.createBook(book, vm.userId);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.userId + "/book");
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