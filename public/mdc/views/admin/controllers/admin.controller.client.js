(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("AdminController", AdminController);

    function AdminController(AdminService, $location, UserService, BookService, RecipeService, adminUser) {
        var vm = this;

        function init() {
            if (!adminUser) {
                $location.url("/error?code=401");
            } else {
                vm.username = adminUser.username;
                vm.uid = adminUser._id;
                vm.admin = true;
            }
        }
        init();

        vm.search = search;
        vm.renderBooks = renderBooks;
        vm.renderUsers = renderUsers;
        vm.renderRecipes = renderRecipes;
        vm.deleteUser = deleteUser;
        vm.deleteBook = deleteBook;
        vm.deleteRecipe = deleteRecipe;
        vm.createUser = createUser;
        vm.createBook = createBook;
        vm.createRecipe = createRecipe;
        vm.updateUser = updateUser;
        vm.updateBook = updateBook;
        vm.updateRecipe = updateRecipe;
        vm.logout = logout;

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $location.url("/login");
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

        function renderRecipes() {
            AdminService.findAllRecipes()
                .then(function (response) {
                    vm.recipes = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching recipes: \n" + err;
                })
        }

        function deleteUser(user, fromDetailsPage) {
            var uid = user._id;
            var answer = confirm("Are you sure?");
            if (answer) {
                UserService.deleteUser(uid)
                    .then(function (response) {
                        if (fromDetailsPage) {
                            $location.url("/admin/user");
                        } else {
                            vm.message = "Successfully deleted user!";
                            renderUsers();
                        }
                    }).catch(function (err) {
                        vm.error = "An uncaught error occurred deleting the user: \n" + err.data;
                    });
            }
        }

        function deleteBook(book, fromDetailsPage) {
            var bid = book._id;
            var answer = confirm("Are you sure?");
            if (answer) {
                BookService.deleteBook(bid)
                    .then(function (response) {
                        if (fromDetailsPage) {
                            $location.url("/admin/book");
                        } else {
                            vm.message = "Successfully deleted book!";
                            renderBooks();
                        }
                    }).catch(function (err) {
                        vm.error = "An uncaught error occurred deleting the book: \n" + err.data;
                    });
            }
        }

        function deleteRecipe(recipe, fromDetailsPage) {
            var rid = recipe._id;
            var answer = confirm("Are you sure?");
            if (answer) {
                RecipeService.deleteRecipe(rid)
                    .then(function (response) {
                        if (fromDetailsPage) {
                            $location.url("/admin/recipe");
                        } else {
                            vm.message = "Successfully deleted recipe!";
                            renderRecipes();
                        }
                    }).catch(function (err) {
                        vm.error = "An uncaught error occurred deleting the recipe: \n" + err.data;
                    });
            }
        }

        function createUser(user) {
            if (!user || !user.username || !user.password || !user.confirmPass) {
                vm.error = "Required fields: Username, Password, ConfirmPassword";
                return;
            } else if (user.password !== user.confirmPass) {
                vm.error = "Passwords do not match!";
                return;
            }
            UserService.createUser(user)
                .then(function (response) {
                    $location.url("/admin/user");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred creating the user: \n" + err.data;
                });
        }

        function createBook(book) {
            if (!book || !book.name || !book._user) {
                vm.error = "Required fields: Name, User";
                return;
            }
            BookService.createBook(book, book._user._id)
                .then(function (response) {
                    $location.url("/admin/book");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred creating the book: \n" + err.data;
                });
        }

        function createRecipe(recipe) {
            //TODO: decide how to do input validation here
            if (!recipe || !recipe.name || !recipe._user) {
                vm.error = "Required fields: Name, User";
                return;
            }
            RecipeService.createRecipe(recipe, recipe._user._id)
                .then(function (response) {
                    $location.url("/admin/recipe");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred creating the recipe: \n" + err.data;
                });
        }

        function updateUser(user) {
            if (!user || !user.username || !user.password || !user.confirmPass) {
                vm.error = "Required fields: Username, Password, ConfirmPassword";
                return;
            } else if (user.password !== user.confirmPass) {
                vm.error = "Passwords do not match!";
                return;
            }
            var uid = user._id;
            UserService.updateUser(uid, user)
                .then(function (response) {
                    $location.url("/admin/user");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred updating the user: \n" + err.data;
                });
        }

        function updateBook(book) {
            if (!book || !book.name) {
                vm.error = "Required fields: Name";
                return;
            }
            var bid = book._id;
            BookService.updateBook(bid, book)
                .then(function (response) {
                    $location.url("/admin/book");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred updating the book: \n" + err.data;
                });
        }

        function updateRecipe(recipe) {
            //TODO: decide how to do input validation here
            if (!recipe || !recipe.name) {
                vm.error = "Required fields: Name";
                return;
            }
            var rid = recipe._id;
            RecipeService.updateRecipe(rid, recipe)
                .then(function (response) {
                    $location.url("/admin/recipe");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred updating the recipe: \n" + err.data;
                });
        }
    }
})();