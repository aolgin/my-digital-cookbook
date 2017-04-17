(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("SearchController", SearchController);

    function SearchController(SearchService, currentUser, $routeParams, UserService, $rootScope) {
        var vm = this;
        var term = $routeParams['term'];
        var type = $routeParams['type'];


        if (currentUser) {
            vm.uid = currentUser._id;
        }

        function init() {
            if (term && type) {
                search(term, type);
            }
        }
        init();
        
        vm.searchUsers = searchUsers;
        vm.searchRecipes = searchRecipes;
        vm.searchBooks = searchBooks;
        vm.searchRecipesByCategory = searchRecipesByCategory;
        vm.search = search;
        vm.logout = logout;

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
                    vm.error = "Please select a search parameter";
                    break;
            }
        }

        function changeSearchType(type) {
            console.log(type);
            vm.searchType = type;
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/");
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
                vm.results = null;
                var status = err.status;
                if (status == 404) {
                    vm.error = 'No users matching your search term found!';
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
                vm.results = null;
                var status = err.status;
                if (status == 404) {
                    vm.error = 'No recipes matching your search term found!';
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
                vm.results = null;
                var status = err.status;
                if (status == 404) {
                    vm.error = 'No recipes matching your search term found!';
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
                vm.results = null;
                var status = err.status;
                if (status == 404) {
                    vm.error = 'No cookbooks matching your search term found!';
                } else {
                    vm.error = 'An uncaught error occurred when searching:\n' + err.data;
                }
            });
        }

    }
})();