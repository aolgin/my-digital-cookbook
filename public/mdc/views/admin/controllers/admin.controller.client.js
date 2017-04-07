(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("AdminController", AdminController);

    function AdminController(AdminService, $location, $rootScope) {
        var vm = this;

        function init() {

        }
        init();

        vm.renderBooks = renderBooks;
        vm.renderUsers = renderUsers;
        vm.renderRecipes = renderRecipes;
        vm.deleteUser = deleteUser;
        vm.login = login;

        function login(user) {
            if (!user.username || !user.password) {
                vm.error = 'Username and Password required';
                return;
            }

            var promise = AdminService.login(user);
            promise.then(function(response) {
                var user = response.data;
                $rootScope.currentUser = user;
                $location.url("/admin");
            }).catch(function (err) {
                console.log(err);
                var status = err.status;
                if (status == 404 || status == 401) {
                    vm.error = 'No admin user found matching those credentials';
                } else {
                    vm.error = 'An uncaught error occurred when logging in:\n' + err.data;
                }
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