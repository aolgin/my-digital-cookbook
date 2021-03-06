(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PasswordController", PasswordController);

    function PasswordController(UserService, currentUser, adminUser, $location) {
        var vm = this;
        vm.uid = currentUser._id;
        vm.username = currentUser.username;
        if (adminUser) {
            vm.admin = true;
        }

        function init() {

        }
        init();

        vm.search = search;
        vm.logout = logout;
        vm.update = update;

        function update(user) {
            if (!user || !user.currentPass || !user.newPass || !user.confirmPass) {
                vm.error = "All fields required!";
                return;
            } else if (user.newPass !== user.confirmPass) {
                vm.error = "New Passwords do not match!";
                return
            }

            UserService.updatePassword(vm.uid, user)
                .then(function (response) {
                    $location.url("/profile");
                }).catch(function (err) {
                    if (err.status === 401) {
                        vm.error = "Password does not match one on file.";
                    } else {
                        vm.error = "An unexpected issue occurred trying to update your password:\n" + err.data;
                    }
                });
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


    }
})();