(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PublicProfileController", PublicProfileController);

    function PublicProfileController(UserService, $routeParams, currentUser) {
        var vm = this;
        vm.chefId = $routeParams['uid'];
        if (currentUser) {
            vm.uid = currentUser._id;
        }

        vm.renderProfile = renderProfile;
        vm.followUser = followUser;
        vm.unfollowUser = unfollowUser;

        function init() {
            renderProfile(vm.chefId);
            if (currentUser) {
                isFollowingChef();
            }
        }
        init();

        function isFollowingChef() {
            UserService.isFollowingChef(vm.uid, vm.chefId)
                .then(function (response) {
                    //TODO: Unsure what this'll come back as right now
                    console.log(response.data);
                    vm.isFollowing = response.data;
                })
        }

        function renderProfile(uid) {
            UserService.findUserById(uid)
                .then(function (response) {
                    vm.user = response.data;
                }).catch(function (err) {
                console.log(err);
                vm.error = "Unable to find a user with the specified ID";
            });
        }

        // TODO: Need a way to check if the ChefId is already in the following of the CurrentUser

        function followUser() {
            UserService.followUser(vm.uid, vm.chefId)
                .then(function (response) {
                    vm.followed = true;
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "An error occurred trying to follow this chef:\n" + err;
                });
        }

        function unfollowUser() {
            UserService.unfollowUser(vm.uid, vm.chefId)
                .then(function (response) {
                    vm.followed = false;
                }).catch(function (err) {
                    console.log(err);
                    vm.error = "An error occurred trying to unfollow this chef:\n" + err;
                });
        }
    }
})();