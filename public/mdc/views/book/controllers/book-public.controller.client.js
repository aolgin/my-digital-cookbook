(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PublicBookController", PublicBookController);

    function PublicBookController(BookService, $routeParams, $location, currentUser, UserService, adminUser, RecipeService) {
        var vm = this;
        vm.bid = $routeParams['bid'];
        if (currentUser) {
            vm.username = currentUser.username;
        }
        if (adminUser) {
            vm.admin = true;
        }

        function init() {
            renderBook();
        }
        init();

        vm.search = search;
        vm.logout = logout;
        vm.detachRecipeFromBook = detachRecipeFromBook;

        function renderBook() {
            BookService.findBookById(vm.bid)
                .then(function (response) {
                    vm.book = response.data;
                    if (vm.book.recipes.length === 0) {
                        vm.noRecipes = true;
                    } else { vm.noRecipes = false; }
                    isYourBook();
                }, function (err) {
                    console.log(err);
                    $location.url("/error?code=404");
                }).catch(function (err) {
                    vm.error = "An error occurred finding this cookbook. We apologize for any inconvenience:\n" + err;
                    vm.yourBook = false;
                });
        }

        function isYourBook() {
            if (currentUser && currentUser._id === vm.book._user._id) {
                vm.yourBook = true;
            } else {
                vm.yourBook = false;
            }
        }

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

        function detachRecipeFromBook(rid) {
            var answer = confirm("Are you sure you would like to remove this recipe from the book?");
            if (answer) {
                RecipeService.detachRecipeFromBook(rid, vm.bid)
                    .then(function (response) {
                        vm.error = null;
                        vm.message = "Successfully removed recipe from " + vm.book.name + "!";
                        renderBook();
                    }).catch(function (err) {
                        vm.message = null;
                        vm.error = "An unexpected error occured while trying to add this recipe to your book:\n" + err;
                    });
            }
        }

    }
})();