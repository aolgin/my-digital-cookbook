(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("ProfileController", ProfileController);

    function ProfileController(UserService, currentUser, adminUser, $location) {
        var vm = this;
        vm.user = currentUser;
        vm.uid = currentUser._id;
        if (adminUser) {
            vm.admin = true;
        }

        function init() {

        }
        init();

        vm.update = update;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        vm.search = search;

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function update(user) {
            if (!user || !user.username) {
                vm.error = "Required Fields: Username";
                return;
            }

            var promise = UserService.updateUser(vm.user._id, user);
            promise.then(function (response) {
                if (response.status == 200) {
                    vm.error = null;
                    vm.message = "Successfully updated user information!";
                }
            }).catch(function (err) {
                vm.message = null;
                var status = err.status;
                if (status == 409) {
                    vm.error = "A user with that username already exists!";
                } else {
                    vm.error = "An uncaught error occurred updating your user information: \n" + err.data;
                }
            });
        }

        function deleteUser() {
            var answer = confirm("Are you sure?");
            if (answer) {
                var promise = UserService.deleteUser(vm.uid);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url('/');
                    }
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred deleting your user: \n" + err.data;
                });
            }
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $location.url("/");
                });
        }
    }
})();