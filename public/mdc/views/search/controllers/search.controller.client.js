(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("SearchController", SearchController);

    function SearchController(SearchService, currentUser, $routeParams, UserService, adminUser, $location) {
        var vm = this;
        vm.term = $routeParams['term'];
        var type = $routeParams['type'];


        if (currentUser) {
            vm.username = currentUser.username;
        }
        if (adminUser) {
            vm.admin = true;
        }

        function init() {
            if (vm.term && type) {
                search(vm.term, type);
            }
        }
        init();
        
        vm.searchUsers = searchUsers;
        vm.searchRecipes = searchRecipes;
        vm.searchBooks = searchBooks;
        // vm.searchRecipesByCategory = searchRecipesByCategory;
        vm.search = search;
        vm.logout = logout;

        function search(term, searchType) {
            vm.term = term;
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
                // case 'Categories':
                //     searchRecipesByCategory(term);
                //     break;
                default:
                    vm.error = "Please select a search parameter";
                    break;
            }
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
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
                vm.results = null;
                var status = err.status;
                if (status == 404) {
                    vm.error = 'No users matching your search term found!';
                } else {
                    vm.error = 'An unexpected error occurred when searching:\n' + err.data;
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
                vm.results = null;
                var status = err.status;
                if (status == 404) {
                    vm.error = 'No recipes matching your search term found!';
                } else {
                    vm.error = 'An unexpected error occurred when searching:\n' + err.data;
                }
            });
        }

        // function searchRecipesByCategory(cat) {
        //     vm.resType = 'recipe';
        //     vm.error = null;
        //     var promise = SearchService.searchRecipesByCategory(cat);
        //     promise.then(function(response) {
        //         vm.results = response.data;
        //     }).catch(function (err) {
        //         console.log(err);
        //         vm.results = null;
        //         var status = err.status;
        //         if (status == 404) {
        //             vm.error = 'No recipes matching your search term found!';
        //         } else {
        //             vm.error = 'An unexpected error occurred when searching:\n' + err.data;
        //         }
        //     });
        // }
        
        function searchBooks(term) {
            vm.resType = 'book';
            vm.error = null;
            var promise = SearchService.searchBooks(term);
            promise.then(function(response) {
                vm.results = response.data;
            }).catch(function (err) {
                vm.results = null;
                var status = err.status;
                if (status == 404) {
                    vm.error = 'No cookbooks matching your search term found!';
                } else {
                    vm.error = 'An unexpected error occurred when searching:\n' + err.data;
                }
            });
        }

    }
})();