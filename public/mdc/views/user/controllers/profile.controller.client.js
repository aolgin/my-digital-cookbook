(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("ProfileController", ProfileController);

    function ProfileController(UserService) {
        var vm = this;

        function init() {

        }
        init();
    }
})();