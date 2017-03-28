(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("BookListController", BookListController);

    function BookListController(BookService) {
        var vm = this;

        function init() {

        }
        init();
    }
})();