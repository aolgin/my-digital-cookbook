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
            "commentOnRecipe": commentOnRecipe,
            "deleteComment": deleteComment,
            "updateComment": updateComment
        };
        return api;

        function commentOnRecipe(comment, rid, uid) {
            return $http.post("/api/recipe/" + rid + "/comment?uid=" + uid, comment);
        }

        function deleteComment(cid, rid) {
            return $http.delete("/api/comment/" + cid + "?rid=" + rid);
        }

        function updateComment(cid, comment) {
            return $http.put("/api/comment/" + cid, comment);
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