(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("RecipeNewController", RecipeNewController);

    function RecipeNewController(RecipeService, $location, currentUser) {
        var vm = this;
        vm.uid = currentUser._id;

        function init() {

        }
        init();

        vm.createRecipe = createRecipe;
        vm.createRecipeInBook = createRecipeInBook;

        function createRecipeInBook(recipe, bid) {
            //TODO: form validation

            var promise = RecipeService.createRecipeInBook(recipe, vm.uid, bid);
            promise.then(function (response) {
                if (response.status == 200) {
                    $location.url("/dashboard/recipes");
                }
            }).catch(function (err) {
                vm.error = "An uncaught error occurred creating your recipe: \n" + err.data;
            });
        }

        function createRecipe(recipe) {
            //TODO: form validation

            var promise = RecipeService.createRecipe(recipe, vm.uid);
            promise.then(function (response) {
                if (response.status == 200) {
                    $location.url("/dashboard/recipes");
                }
            }).catch(function (err) {
                vm.error = "An uncaught error occurred creating your recipe: \n" + err.data;
            });
        }
    }
})();