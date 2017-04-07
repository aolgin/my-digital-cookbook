(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("DashboardController", DashboardController);

    function DashboardController(UserService, currentUser) {
        var vm = this;
        vm.uid = currentUser._id;

        function init() {
            renderBooks();
            renderRecipes();
            // renderFavorites();
            renderFeed();
        }
        init();

        function renderBooks() {
            var promise = UserService.findBooksByUserId(vm.uid);
            promise.then(function (response) {
                vm.books = response.data;
            }).catch(function (err) {
                console.log("Error acquiring books: " + err);
                vm.error = err;
            });
        }


        // TODO: Incorporate later once proper logic and infrastructure is in place for this.
        function renderFavorites() {
            var promise = UserService.findUserFavorites(vm.uid);
            promise.then(function (response) {
                vm.favorites = response.data;
            }).catch(function (err) {
                console.log("Error acquiring books: " + err);
                vm.error = err;
            });
        }

        function renderRecipes() {
            var promise = UserService.findRecipesByUserId(vm.uid);
            promise.then(function (response) {
                vm.recipes = response.data;
            }).catch(function (err) {
                console.log("Error acquiring recipes: " + err);
                vm.error = err;
            });
        }

        function renderFeed() {
            console.log("Rendering feed...");
        }
    }
})();