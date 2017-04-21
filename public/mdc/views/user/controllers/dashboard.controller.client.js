(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("DashboardController", DashboardController);

    function DashboardController(UserService, currentUser, $location, NotificationService, adminUser) {
        var vm = this;
        vm.username = currentUser.username;
        vm.uid = currentUser._id;
        if (adminUser) {
            vm.admin = true;
        }

        function init() {
            var path = $location.path();
            // divvy up the path, and then route to specific rendering functions based on it
            var pathParts = path.split("/");
            if (pathParts.length === 2) {
                renderDashboard();
            } else {
                var page = pathParts[2];
                switch (page) {
                    case 'books':
                        renderBooks(500);
                        break;
                    case 'recipes':
                        renderRecipes(500);
                        break;
                    case 'following':
                        renderFollowing();
                        break;
                }
            }
        }
        init();

        vm.search = search;
        vm.logout = logout;

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $location.url("/");
                });
        }

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function renderDashboard() {
            renderBooks(3);
            renderRecipes(3);
            renderFeed();
        }

        function renderBooks(limit) {
            var promise = UserService.findBooksByUserId(vm.uid, limit);
            promise.then(function (response) {
                vm.books = response.data;
                if (vm.books.length === 0) {
                    vm.book_msg = "No cookbooks created yet! Go to the cookbooks tab to make one";
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
                if (vm.recipes.length === 0) {
                    vm.recipe_msg = "No recipes created yet! Go to the recipes tab to make one";
                }
            }).catch(function (err) {
                console.log("Error acquiring recipes:\n" + err);
                vm.error = err;
            });
        }

        function renderFollowing() {
            var promise = UserService.findFollowingByUserId(vm.uid);
            promise.then(function (response) {
                vm.following = response.data;
                if (vm.following.length === 0) {
                    vm.following_msg = "Not following anyone yet!";
                }
            }).catch(function (err) {
                console.log("Error finding following:\n" + err);
                vm.error = err;
            });
        }

        function renderFeed() {
            var following = currentUser.following;
            console.log("Rendering feed...");
            if (!following || following.length === 0) {
                vm.feed_msg = "You aren\'t following anyone yet! Follow someone to start acquiring a feed.";
            } else {
                vm.feed_msg = "This feature is not yet ready.";
                // var promise = NotificationService.findNotificationsForUsers(following);
                // promise.then(function (response) {
                //         vm.feed = response.data;
                //     }).catch(function (err) {
                //         console.log("Error populating feed:\n" + err);
                //         vm.error = err;
                //     });
            }
        }
    }
})();