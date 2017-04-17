(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PublicRecipeController", PublicRecipeController);

    function PublicRecipeController(RecipeService, $routeParams, $sce, currentUser, UserService, $rootScope) {
        var vm = this;
        vm.rid = $routeParams['rid'];
        if (currentUser) {
            vm.uid = currentUser._id;
        }


        function init() {
            RecipeService.findRecipeById(vm.rid)
                .then(function (response) {
                    vm.recipe = response.data;
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "An error occurred finding this recipe. We apologize for any inconvenience";
                });
        }
        init();

        vm.getTrustedHtml = getTrustedHtml;
        vm.favoriteRecipe = favoriteRecipe;
        vm.unfavoriteRecipe = unfavoriteRecipe;
        vm.rateRecipe = rateRecipe;
        vm.search = search;
        vm.logout = logout;

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/");
                });
        }

        function checkLogin() {
            return vm.uid &&
                    vm.uid !== recipe._user;
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function favoriteRecipe() {
            if (!checkLogin) {
                vm.error = "Please sign to favorite a recipe!";
                return;
            }
            var promise = RecipeService.favorite(vm.uid, recipe._id);

        }

        function unfavoriteRecipe() {
            if (!checkLogin) {
                vm.error = "Please sign to unfavorite a recipe!";
                return;
            }
            var promise = RecipeService.unfavorite(vm.uid, recipe._id);
        }

        function rateRecipe(rating) {
            if (!checkLogin) {
                vm.error = "Please sign to rate a recipe!";
                return;
            }
            var promise = RecipeService.rateRecipe(recipe._id, rating);


        }

    }
})();