(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("RecipeListController", RecipeListController);

    function RecipeListController(RecipeService) {
        var vm = this;

        function init() {

        }
        init();
    }
})();