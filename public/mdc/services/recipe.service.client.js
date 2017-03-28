(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('RecipeService', recipeService);

    function recipeService($http) {

        var api = {
            "findRecipesByUserId": findRecipesByUserId,
            "createRecipe": createRecipe,
            "deleteRecipe": deleteRecipe,
            "updateRecipe": updateRecipe,
            "findRecipeById": findRecipeById
        };
        return api;

        function findRecipeById(rid) {
            return $http.get("/api/recipe/" + rid);
        }

        function findRecipesByUserId(bid) {
            return $http.get("/api/book/" + bid + "/recipe");
        }

        function createRecipe(recipe, bid) {
            return $http.post("/api/book/" + bid + "/recipe", recipe);
        }

        function deleteRecipe(rid) {
            return $http.delete("/api/recipe/" + rid);
        }

        function updateRecipe(rid, newRecipe) {
            return $http.put("/api/recipe/" + rid, newRecipe);
        }
    }
})();