(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("AdminBookController", AdminBookController);

    function AdminBookController(AdminService, $location, UserService, BookService, adminUser, $routeParams) {
        var vm = this;

        function init() {
            if (!adminUser) {
                $location.url("/error?code=401");
            } else {
                vm.username = adminUser.username;
                vm.uid = adminUser._id;
                vm.admin = true;
                renderBooks();
            }
        }
        init();

        vm.search = search;
        vm.renderBooks = renderBooks;
        vm.renderUsers = renderUsers;
        vm.deleteBook = deleteBook;
        vm.createBook = createBook;
        vm.updateBook = updateBook;
        vm.renderDetails = renderDetails;
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

        function renderDetails() {
            var bid = $routeParams['bid'];
            BookService.findBookById(bid)
                .then(function (response) {
                    vm.book = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching book:\n" + err;
                });
        }

        function renderBooks() {
            AdminService.findAllBooks()
                .then(function (response) {
                    vm.books = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching books: \n" + err;
                })
        }

        function renderUsers() {
            AdminService.findAllUsers()
                .then(function (response) {
                    vm.users = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching users: \n" + err;
                })
        }

        function deleteBook(book, fromDetailsPage) {
            var bid = book._id;
            var answer = confirm("Are you sure?");
            if (answer) {
                AdminService.deleteBook(bid, book)
                    .then(function (response) {
                        if (fromDetailsPage) {
                            $location.url("/admin/book");
                        } else {
                            vm.message = "Successfully deleted book!";
                            renderBooks();
                        }
                    }).catch(function (err) {
                        if (err.status === 401) {
                            vm.error = "You are not authorized to perform that action";
                        } else {
                            vm.error = "An unexpected error occurred deleting the book: \n" + err.data;
                        }
                    });
            }
        }

        function createBook(book) {
            if (!book || !book.name || !book._user) {
                vm.error = "Required fields: Name, User";
                return;
            }
            AdminService.createBook(book, book._user._id)
                .then(function (response) {
                    $location.url("/admin/book");
                }).catch(function (err) {
                    if (err.status === 401) {
                        vm.error = "You are not authorized to perform that action";
                    } else {
                        vm.error = "An unexpected error occurred creating the book: \n" + err.data;
                    }
                });
        }

        function updateBook(book) {
            if (!book || !book.name) {
                vm.error = "Required fields: Name";
                return;
            }
            var bid = book._id;
            AdminService.updateBook(bid, book)
                .then(function (response) {
                    $location.url("/admin/book");
                }).catch(function (err) {
                    if (err.status === 401) {
                        vm.error = "You are not authorized to perform that action";
                    } else {
                        vm.error = "An unexpected error occurred updating the book: \n" + err.data;
                    }
                });
        }
    }
})();