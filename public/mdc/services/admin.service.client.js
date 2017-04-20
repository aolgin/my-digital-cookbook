(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('AdminService', AdminService);

    function AdminService($http) {

        var api = {
            "findAllUsers": findAllUsers,
            "findAllBooks": findAllBooks,
            "findAllRecipes": findAllRecipes,
            "createUser": createUser,
            "createBook": createBook,
            "createRecipe": createRecipe,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "isAdmin": isAdmin
        };
        return api;

        function isAdmin() {
            return $http.get('/api/user/isAdmin');
        }

        function findAllUsers() {
            return $http.get("/api/admin/users");
        }

        function findAllBooks() {
            return $http.get("/api/admin/books");
        }

        function findAllRecipes() {
            return $http.get("/api/admin/recipes");
        }

        function createUser(user) {
            return $http.post('/api/admin/user', user);
        }

        function createBook(book) {
            return $http.post('/api/admin/book', book);
        }

        function createRecipe(recipe) {
            return $http.post('/api/admin/recipe', recipe);
        }

        function updateUser(uid, user) {
            return $http.put('/api/admin/user/' + uid, user);
        }

        function deleteUser(uid) {
            return $http.delete('/api/admin/user/' + uid);
        }

    }
})();