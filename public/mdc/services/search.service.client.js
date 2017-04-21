(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('SearchService', searchService);

    function searchService($http) {

        var api = {
            "searchUsers": searchUsers,
            "searchBooks": searchBooks,
            "searchRecipes": searchRecipes
            // "searchRecipesByCategory": searchRecipesByCategory
        };
        return api;

        function searchUsers(term) {
            return $http.get("/api/user/search?term=" + term);
        }

        function searchBooks(term) {
            return $http.get("/api/book/search?term=" + term);
        }

        function searchRecipes(term) {
            return $http.get("/api/recipe/search?term=" + term);
        }

        // function searchRecipesByCategory(cat) {
        //     return $http.get("/api/recipe/search?category=" + cat);
        // }
    }
})();