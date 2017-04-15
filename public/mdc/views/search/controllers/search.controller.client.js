(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("SearchController", SearchController);

    function SearchController(SearchService, currentUser) {
        var vm = this;
        if (currentUser) {
            vm.user = currentUser;
        }

        function init() {

        }
        init();
        
        vm.searchUsers = searchUsers;
        vm.searchRecipes = searchRecipes;
        vm.searchBooks = searchBooks;
        vm.searchRecipesByCategory = searchRecipesByCategory;
        vm.changeSearchType = changeSearchType;
        vm.search = search;

        function search(term, searchType) {
            switch (searchType) {
                case 'Chefs':
                    searchUsers(term);
                    break;
                case 'Cookbooks':
                    searchBooks(term);
                    break;
                case 'Recipes':
                    searchRecipes(term);
                    break;
                case 'Categories':
                    searchRecipesByCategory(term);
                    break;
                default:
                    searchAll(term);
                    break;
            }
        }

        function changeSearchType(type) {
            console.log(type);
            vm.searchType = type;
        }

        function searchAll(term) {
            vm.error = null;
            var promise = SearchService.searchAll(term);
            promise.then(function(response) {
                vm.results = response.data;
            }).catch(function (err) {
                console.log(err);
                var status = err.status;
                if (status == 404) {
                    vm.error = 'Nothing matching your search term found!';
                } else {
                    vm.error = 'An uncaught error occurred when searching:\n' + err.data;
                }
            });
        }

        function searchUsers(term) {
            vm.resType = 'user';
            vm.error = null;
            var promise = SearchService.searchUsers(term);
            promise.then(function(response) {
                vm.results = response.data;
            }).catch(function (err) {
                console.log(err);
                var status = err.status;
                if (status == 404) {
                    vm.error = 'Nothing users matching your search term found!';
                } else {
                    vm.error = 'An uncaught error occurred when searching:\n' + err.data;
                }
            });
        }
        
        function searchRecipes(term) {
            vm.resType = 'recipe';
            vm.error = null;
            var promise = SearchService.searchRecipes(term);
            promise.then(function(response) {
                vm.results = response.data;
            }).catch(function (err) {
                console.log(err);
                var status = err.status;
                if (status == 404) {
                    vm.error = 'Nothing recipes matching your search term found!';
                } else {
                    vm.error = 'An uncaught error occurred when searching:\n' + err.data;
                }
            });
        }

        function searchRecipesByCategory(cat) {
            vm.resType = 'recipe';
            vm.error = null;
            var promise = SearchService.searchRecipesByCategory(cat);
            promise.then(function(response) {
                vm.results = response.data;
            }).catch(function (err) {
                console.log(err);
                var status = err.status;
                if (status == 404) {
                    vm.error = 'Nothing recipes matching your search term found!';
                } else {
                    vm.error = 'An uncaught error occurred when searching:\n' + err.data;
                }
            });
        }
        
        function searchBooks(term) {
            vm.resType = 'book';
            vm.error = null;
            var promise = SearchService.searchBooks(term);
            promise.then(function(response) {
                vm.results = response.data;
            }).catch(function (err) {
                console.log(err);
                var status = err.status;
                if (status == 404) {
                    vm.error = 'Nothing cookbooks matching your search term found!';
                } else {
                    vm.error = 'An uncaught error occurred when searching:\n' + err.data;
                }
            });
        }

    }
})();