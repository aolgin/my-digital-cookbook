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
                    if (vm.recipe.comments.length === 0) {
                        vm.commentsMsg = "No comments yet! Please login to comment and rate this recipe.";
                    }
                    isYourRecipe();
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "An error occurred finding this recipe. We apologize for any inconvenience";
                    vm.yourRecipe = false;
                });
        }
        init();

        vm.getTrustedHtml = getTrustedHtml;
        vm.rateRecipe = rateRecipe;
        vm.search = search;
        vm.logout = logout;
        vm.comment = comment;
        vm.commentBoxToggle = commentBoxToggle;

        function setComments() {
            if (vm.uid) {

            }
        }

        function commentBoxToggle() {
            if (!vm.showCommentBox) {
                vm.showCommentBox = true;
            } else {
                vm.showCommentBox = false;
            }
        }

        function comment(text, rating) {

        }

        function isYourRecipe() {
            if (currentUser && currentUser._id === vm.recipe._user._id) {
                vm.yourRecipe = true;
            } else {
                vm.yourRecipe = false;
            }
        }

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

        function rateRecipe(rating) {
            if (!checkLogin) {
                vm.error = "Please sign to rate a recipe!";
                return;
            }
            var promise = RecipeService.rateRecipe(recipe._id, rating);


        }

    }
})();