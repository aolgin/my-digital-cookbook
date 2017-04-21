(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('RecipeService', recipeService);

    function recipeService($http) {

        var api = {
            "findRecipesByBookId": findRecipesByBookId,
            "createRecipe": createRecipe,
            "createRecipeInBook": createRecipeInBook,
            "deleteRecipe": deleteRecipe,
            "updateRecipe": updateRecipe,
            "findRecipeById": findRecipeById,
            "rateRecipe": rateRecipe,
            "favorite": favorite,
            "unfavorite": unfavorite
        };
        return api;

        function rateRecipe(rid, rating) {
            return $http.post("/api/recipe/" + rid + "?rating=" + rating);
        }

        function favorite(uid, rid) {
            return $http.put("/api/user/" + uid + "/favorite?rid=" + rid);
        }

        function unfavorite(uid, rid) {
            return $http.put("/api/user/" + uid + "/unfavorite?rid=" + rid);
        }

        function findRecipeById(rid) {
            return $http.get("/api/recipe/" + rid);
        }

        function findRecipesByBookId(bid) {
            return $http.get("/api/book/" + bid + "/recipe");
        }

        function createRecipeInBook(recipe, uid, bid) {
            return $http.post("/api/user/" + uid + "/book/" + bid + "/recipe", recipe);
        }

        function createRecipe(recipe, uid) {
            return $http.post("/api/user/" + uid + "/recipe", recipe);
        }

        function deleteRecipe(rid) {
            return $http.delete("/api/recipe/" + rid);
        }

        function updateRecipe(rid, newRecipe) {
            return $http.put("/api/recipe/" + rid, newRecipe);
        }
    }
})();