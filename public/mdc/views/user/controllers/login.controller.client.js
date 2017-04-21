(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("LoginController", LoginController);

    function LoginController(UserService, $location) {
        var vm = this;
        vm.login = login;
        vm.search = search;

        function init() {}
        init();

        function login(user) {
            if (!user.username || !user.password) {
                vm.error = 'Username and Password required';
                return;
            }

            var promise = UserService.login(user);
            promise.then(function(response) {
                var user = response.data;
                if (user) {
                    $location.url("/dashboard");
                }
            }).catch(function (err) {
                var status = err.status;
                if (status == 404 || status == 401) {
                    vm.error = 'No user found matching those credentials';
                } else {
                    vm.error = 'An uncaught error occurred when logging in:\n' + err.data;
                }
            });
        }

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }
    }
})();