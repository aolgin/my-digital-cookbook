(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("DashboardController", DashboardController);

    function DashboardController(UserService, currentUser, $location) {
        var vm = this;
        vm.uid = currentUser._id;

        function init() {
            var path = $location.path();
            // divvy up the path, and then route to specific rendering functions based on it
            var pathParts = path.split("/");
            if (pathParts.length == 2) {
                renderDashboard();
            } else {
                var page = pathParts[2];
                // console.log(page);
                switch (page) {
                    case 'books':
                        renderBooks(500);
                        break;
                    case 'recipes':
                        renderRecipes(500);
                        break;
                    case 'favorites':
                        // renderFavorites(500);
                        break;
                    case 'friends':
                        renderFriends();
                        break;
                }
            }
        }
        init();

        function renderDashboard() {
            renderBooks(3);
            renderRecipes(3);
            // renderFavorites(3);
            // renderFeed();
        }

        function renderBooks(limit) {
            var promise = UserService.findBooksByUserId(vm.uid, limit);
            promise.then(function (response) {
                vm.books = response.data;
                if (vm.books.length == 0) {
                    vm.book_msg = "No cookbooks created yet! Go to the cookbooks tab to make one";
                }
            }).catch(function (err) {
                console.log("Error acquiring books: " + err);
                vm.error = err;
            });
        }


        // TODO: Incorporate later once proper logic and infrastructure is in place for this.
        function renderFavorites(limit) {
            var promise = UserService.findUserFavorites(vm.uid, limit);
            promise.then(function (response) {
                vm.favorites = response.data;
                if (vm.favorites.length == 0) {
                    vm.favorite_msg = "No favorites yet!";
                }
            }).catch(function (err) {
                console.log("Error acquiring books: " + err);
                vm.error = err;
            });
        }

        function renderRecipes(limit) {
            var promise = UserService.findRecipesByUserId(vm.uid, limit);
            promise.then(function (response) {
                vm.recipes = response.data;
                if (vm.recipes.length == 0) {
                    vm.recipe_msg = "No recipes created yet! Go to the recipes tab to make one";
                }
            }).catch(function (err) {
                console.log("Error acquiring recipes: " + err);
                vm.error = err;
            });
        }


        function renderFriends() {
            var promise = UserService.findFriendsByUser(vm.uid);
            promise.then(function (response) {
                vm.friends = response.data;
                if (vm.friends.length == 0) {
                    vm.friend_msg = "No friends added yet!";
                }
            }).catch(function (err) {
                console.log("Error finding friends: " + err);
                vm.error = err;
            });
        }

        function renderFeed() {
            console.log("Rendering feed...");
        }
    }
})();