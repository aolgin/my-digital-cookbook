(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PublicProfileController", PublicProfileController);

    function PublicProfileController(UserService, $routeParams, currentUser, adminUser, $location) {
        var vm = this;
        vm.chefId = $routeParams['uid'];
        if (currentUser) {
            vm.uid = currentUser._id;
            vm.username = currentUser.username;
        }
        if (adminUser) {
            vm.admin = true;
        }

        vm.renderProfile = renderProfile;
        vm.followUser = followUser;
        vm.unfollowUser = unfollowUser;
        vm.search = search;
        vm.logout = logout;

        function init() {
            renderProfile(vm.chefId);
            renderBooks(vm.chefId);
            renderRecipes(vm.chefId);
            if (currentUser) {
                areYouTheChef();
                if (!vm.yourProfile) {
                    isFollowingChef();
                }
            }
        }
        init();

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

        function areYouTheChef() {
            if (!vm.uid || vm.uid !== vm.chefId) {
                vm.yourProfile = false;
            } else {
                vm.yourProfile = true;
            }
        }

        function isFollowingChef() {
            UserService.isFollowingChef(vm.uid, vm.chefId)
                .then(function (response) {
                    var following = response.data;
                    vm.isFollowing = following.includes(vm.chefId);
                }, function (err) {
                    vm.error = "Unexpected error occurred when trying to determine if you are following this chef:\n" + err.data;
                })
        }

        function renderProfile(uid) {
            UserService.findUserById(uid)
                .then(function (response) {
                    vm.user = response.data;
                    vm.user.password = undefined;
                    vm.numRecipes = vm.user.recipes.length;
                    vm.numBooks = vm.user.books.length;
                    vm.numFollowers= vm.user.follower_count;
                }).catch(function (err) {
                    vm.error = "Error rendering chef\'s profile:\n" + err.data;
                });
        }

        function renderBooks(uid) {
            UserService.findBooksByUserId(uid, 5)
                .then(function (response) {
                    vm.books = response.data;
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "Error rendering user\'s books:\n" + err.data;
                });
        }

        function renderRecipes(uid) {
            UserService.findRecipesByUserId(uid, 5)
                .then(function (response) {
                    vm.recipes = response.data;
                }).catch(function (err) {
                    vm.error = "Error rendering user\'s recipes:\n" + err.data;
                });
        }

        function followUser() {
            UserService.followUser(vm.uid, vm.chefId)
                .then(function (response) {
                    vm.isFollowing = true;
                    renderProfile(vm.chefId);
                }).catch(function (err) {
                    if (err.status === 401) {
                        vm.error = "You are not authorized to perform this action";
                    } else {
                        vm.error = "An error occurred trying to follow this chef:\n" + err.data;
                    }
                });
        }

        function unfollowUser() {
            UserService.unfollowUser(vm.uid, vm.chefId)
                .then(function (response) {
                    vm.isFollowing = false;
                    renderProfile(vm.chefId);
                }).catch(function (err) {
                    if (err.status === 401) {
                        vm.error = "You are not authorized to perform this action";
                    } else {
                        vm.error = "An error occurred trying to unfollow this chef:\n" + err.data;
                    }
                });
        }
    }
})();