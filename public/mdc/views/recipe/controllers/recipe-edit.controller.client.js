(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("RecipeEditController", RecipeEditController);

    function RecipeEditController(RecipeService, $routeParams, $location) {
        var vm = this;
        vm.rid = $routeParams['rid'];

        function init() {
            RecipeService.findRecipeById(vm.rid)
                .then(function(response) {
                    vm.recipe = response.data;
                });
        }
        init();

        vm.deleteRecipe = deleteRecipe;
        vm.updateRecipe = updateRecipe;
        vm.detachRecipe = detachRecipe;

        function deleteRecipe() {
            var answer = confirm("Delete this recipe?");
            if (answer) {
                var promise = RecipeService.deleteRecipe(vm.rid);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url("/dashboard/recipes");
                    }
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred deleting your recipe: \n" + err.data;
                });
            }
        }

        function updateRecipe(rid, recipe) {
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