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
                        renderBooks();
                        break;
                    case 'recipes':
                        renderRecipes();
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
        vm.unfollowUser = unfollowUser;

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

        function unfollowUser(chefId) {
            UserService.unfollowUser(vm.uid, chefId)
                .then(function (response) {
                    renderFollowing();
                }).catch(function (err) {
                    if (err.status === 401) {
                        vm.error = "You are not authorized to perform this action";
                    } else {
                        vm.error = "An error occurred trying to unfollow this chef:\n" + err.data;
                    }
                });
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
                vm.error = "An unexpected error occurred while trying to render your cookbooks: \n" + err.data;
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
                vm.error = "An unexpected error occurred while trying to render your recipes: \n" + err.data;
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
                vm.error = "An unexpected error occurred while trying to render your following: \n" + err.data;
            });
        }

        function renderFeed() {
            var following = currentUser.following;
            var limit = 30;
            if (!following || following.length === 0) {
                vm.feed_msg = "You aren\'t following anyone yet! Follow someone to start acquiring a feed.";
            } else {
                var promise = NotificationService.findUserFeed(vm.uid, limit);
                promise.then(function (response) {
                    var feed = response.data;
                    if (feed.length > 0) {
                        vm.feed = feed;
                    } else {
                        vm.feed_msg = "Your feed is currently empty!";
                    }
                }).catch(function (err) {
                   vm.error = "An unexpected error occurred while trying to render your feed: \n" + err.data;
                });
            }
        }
    }
})();