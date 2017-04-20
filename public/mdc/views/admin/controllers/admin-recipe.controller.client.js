(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("AdminRecipeController", AdminRecipeController);

    function AdminRecipeController(AdminService, $location, UserService, RecipeService, adminUser, $routeParams) {
        var vm = this;

        function init() {
            if (!adminUser) {
                $location.url("/error?code=401");
            } else {
                vm.username = adminUser.username;
                vm.uid = adminUser._id;
                vm.admin = true;
                renderRecipes();
            }
        }
        init();

        vm.search = search;
        vm.renderBooks = renderBooks;
        vm.renderUsers = renderUsers;
        vm.renderRecipes = renderRecipes;
        vm.deleteRecipe = deleteRecipe;
        vm.createRecipe = createRecipe;
        vm.updateRecipe = updateRecipe;
        vm.renderDetails = renderDetails;
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

        function renderDetails() {
            var rid = $routeParams['rid'];
            RecipeService.findRecipeById(rid)
                .then(function (response) {
                    vm.recipe = response.data;
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "Error fetching recipe:\n" + err;
                });
        }

        function renderBooks() {
            AdminService.findAllBooks()
                .then(function (response) {
                    vm.books = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching books: \n" + err;
                });
        }

        function renderUsers() {
            AdminService.findAllUsers()
                .then(function (response) {
                    vm.users = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching users: \n" + err;
                });
        }

        function renderRecipes() {
            AdminService.findAllRecipes()
                .then(function (response) {
                    vm.recipes = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching recipes: \n" + err;
                });
        }

        function deleteRecipe(recipe, fromDetailsPage) {
            var rid = recipe._id;
            var answer = confirm("Are you sure?");
            if (answer) {
                AdminService.deleteRecipe(rid, recipe)
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

        function createRecipe(recipe) {
            //TODO: decide how to do input validation here
            if (!recipe || !recipe.name || !recipe._user) {
                vm.error = "Required fields: Name, User";
                return;
            }
            AdminService.createRecipe(recipe, recipe._user._id)
                .then(function (response) {
                    $location.url("/admin/recipe");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred creating the recipe: \n" + err.data;
                });
        }

        function updateRecipe(recipe) {
            //TODO: decide how to do input validation here
            if (!recipe || !recipe.name) {
                vm.error = "Required fields: Name";
                return;
            }
            var rid = recipe._id;
            AdminService.updateRecipe(rid, recipe)
                .then(function (response) {
                    $location.url("/admin/recipe");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred updating the recipe: \n" + err.data;
                });
        }
    }
})();