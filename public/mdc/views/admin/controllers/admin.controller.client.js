(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("AdminController", AdminController);

    function AdminController(AdminService, $location, UserService, adminUser) {
        var vm = this;

        function init() {
            if (!adminUser) {
                $location.url("/error?code=401");
            } else {
                vm.uid = adminUser._id;
            }
        }
        init();

        vm.renderBooks = renderBooks;
        vm.renderUsers = renderUsers;
        vm.renderRecipes = renderRecipes;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $location.url("/login");
                });
        }

        function renderBooks() {
            AdminService.findAllBooks()
                .then(function (response) {
                    vm.books = response.data;
                }).catch(function (err) {
                vm.error = "Error fetching books: \n" + err;
            })
        }

        function renderUsers() {
            AdminService.findAllUsers()
                .then(function (response) {
                    vm.users = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching users: \n" + err;
                })
        }

        function renderRecipes() {
            AdminService.findAllRecipes()
                .then(function (response) {
                    vm.recipes = response.data;
                }).catch(function (err) {
                    vm.error = "Error fetching recipes: \n" + err;
                })
        }

        function deleteUser(user) {
            var uid = user._id;
            var answer = confirm("Are you sure?");
            if (answer) {
                UserService.deleteUser(uid)
                    .then(function (response) {
                        if (response.status == 200) {
                            $location.url('/login');
                        }
                    }).catch(function (err) {
                        vm.error = "An uncaught error occurred deleting the user: \n" + err.data;
                    });
            }
        }
    }
})();