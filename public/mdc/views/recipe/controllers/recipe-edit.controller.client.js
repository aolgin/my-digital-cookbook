(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("RecipeEditController", RecipeEditController);

    function RecipeEditController(RecipeService, $routeParams, $location, currentUser, UserService, adminUser) {
        var vm = this;
        vm.rid = $routeParams['rid'];
        if (adminUser) {
            vm.admin = true;
        }

        function init() {
            RecipeService.findRecipeById(vm.rid)
                .then(function(response) {
                    if (!currentUser || currentUser._id !== vm.recipe._user._id) {
                        $location.url("/error?code=401");
                    } else {
                        vm.recipe = response.data;
                        vm.username = currentUser.username;
                    }
                }, function (err) {
                    $location.url("/error?code=404");
                });
        }
        init();

        vm.deleteRecipe = deleteRecipe;
        vm.updateRecipe = updateRecipe;
        vm.detachRecipe = detachRecipe;
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

        function deleteRecipe() {
            var answer = confirm("Delete this recipe?");
            if (answer) {
                var promise = RecipeService.deleteRecipe(vm.rid, vm.recipe);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url("/dashboard/recipes");
                    }
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred deleting your recipe: \n" + err.data;
                });
            }
        }

        function updateRecipe(recipe) {
        //    TODO: form validation
            var promise = RecipeService.updateRecipe(vm.rid, recipe);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/dashboard/recipes");
                }
            }).catch(function(err) {
                vm.error = "An uncaught error occurred when updating your recipe: \n" + err.data;
            });

        }

        function detachRecipe(rid, bid) {

        }
    }
})();