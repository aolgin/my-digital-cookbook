(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("AdminUserController", AdminUserController);

    function AdminUserController(AdminService, $location, UserService, adminUser) {
        var vm = this;

        function init() {
            if (!adminUser) {
                $location.url("/error?code=401");
            } else {
                vm.username = adminUser.username;
                vm.uid = adminUser._id;
                vm.admin = true;
                renderUsers();
            }
        }
        init();

        vm.search = search;
        vm.renderUsers = renderUsers;
        vm.deleteUser = deleteUser;
        vm.createUser = createUser;
        vm.updateUser = updateUser;
        vm.logout = logout;

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $location.url("/login");
                });
        }

        function renderUsers() {
            AdminService.findAllUsers()
                .then(function (response) {
                    vm.users = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching users: \n" + err;
                })
        }

        function deleteUser(user, fromDetailsPage) {
            var uid = user._id;
            var answer = confirm("Are you sure?");
            if (answer) {
                UserService.deleteUser(uid)
                    .then(function (response) {
                        if (fromDetailsPage) {
                            $location.url("/admin/user");
                        } else {
                            vm.message = "Successfully deleted user!";
                            renderUsers();
                        }
                    }).catch(function (err) {
                        vm.error = "An uncaught error occurred deleting the user: \n" + err.data;
                    });
            }
        }

        function createUser(user) {
            if (!user || !user.username || !user.password || !user.confirmPass) {
                vm.error = "Required fields: Username, Password, ConfirmPassword";
                return;
            } else if (user.password !== user.confirmPass) {
                vm.error = "Passwords do not match!";
                return;
            }
            UserService.createUser(user)
                .then(function (response) {
                    $location.url("/admin/user");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred creating the user: \n" + err.data;
                });
        }

        function updateUser(user) {
            if (!user || !user.username || !user.password || !user.confirmPass) {
                vm.error = "Required fields: Username, Password, ConfirmPassword";
                return;
            } else if (user.password !== user.confirmPass) {
                vm.error = "Passwords do not match!";
                return;
            }
            var uid = user._id;
            UserService.updateUser(uid, user)
                .then(function (response) {
                    $location.url("/admin/user");
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred updating the user: \n" + err.data;
                });
        }
    }
})();