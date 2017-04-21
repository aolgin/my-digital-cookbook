(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("RecipeNewController", RecipeNewController);

    function RecipeNewController(RecipeService, $location, currentUser, UserService, adminUser) {
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

        vm.createRecipe = createRecipe;
        vm.createRecipeInBook = createRecipeInBook;
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

        function createRecipeInBook(recipe, bid) {
            //TODO: form validation

            var promise = RecipeService.createRecipeInBook(recipe, vm.uid, bid);
            promise.then(function (response) {
                if (response.status === 200) {
                    $location.url("/dashboard/recipes");
                }
            }).catch(function (err) {
                if (err.status === 401) {
                    vm.error = "You are not authorized to perform this action";
                } else {
                    vm.error = "An unexpected error occurred creating your recipe: \n" + err.data;
                }
            });
        }

        function createRecipe(recipe) {
            //TODO: form validation

            var promise = RecipeService.createRecipe(recipe, vm.uid);
            promise.then(function (response) {
                if (response.status === 200) {
                    $location.url("/dashboard/recipes");
                }
            }).catch(function (err) {
                if (err.status === 401) {
                    vm.error = "You are not authorized to perform this action";
                } else {
                    vm.error = "An unexpected error occurred creating your recipe: \n" + err.data;
                }
            });
        }
    }
})();