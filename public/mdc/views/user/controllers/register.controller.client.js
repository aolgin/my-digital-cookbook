(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("RegisterController", RegisterController);

    function RegisterController(UserService, $location, $rootScope) {
        var vm = this;

        function init() {

        }
        init();

        vm.register = register;

        function register(user) {
            // This is done client-side, so no need to put it within the promise execution
            if (!user || !user.username || !user.password || !user.confirmPass) {
                vm.error = 'Required fields: Username, Password, Confirm Password';
                return;
            } else if (user.password != user.confirmPass) {
                vm.error = "Passwords do not match!";
                return;
            }

            UserService.register(user)
                .then(
                    function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url("/dashboard");
                    }
                ).catch(function (err) {
                    var status = err.status;
                    if (status == 409) {
                        vm.error = "User with that username already exists: " + user.username;
                    } else {
                        vm.error = "An uncaught error occurred registering your user: \n" + err.data;
                    }
                });
        }
    }
})();