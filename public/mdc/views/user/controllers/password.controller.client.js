(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PasswordController", PasswordController);

    function PasswordController(UserService, currentUser) {
        var vm = this;
        vm.uid = currentUser._id;

        function init() {

        }
        init();
    }
})();