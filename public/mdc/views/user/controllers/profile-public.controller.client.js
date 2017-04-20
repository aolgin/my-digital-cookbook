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
                    console.log(err);
                    vm.error = "Unexpected error occurred when trying to determine if you are following this chef:\n" + err;
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
                    console.log(err);
                    vm.error = "Unable to find a user with the specified ID";
                });
        }

        function followUser() {
            UserService.followUser(vm.uid, vm.chefId)
                .then(function (response) {
                    vm.isFollowing = true;
                    renderProfile(vm.chefId);
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "An error occurred trying to follow this chef:\n" + err;
                });
        }

        function unfollowUser() {
            UserService.unfollowUser(vm.uid, vm.chefId)
                .then(function (response) {
                    vm.isFollowing = false;
                    renderProfile(vm.chefId);
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "An error occurred trying to unfollow this chef:\n" + err;
                });
        }
    }
})();