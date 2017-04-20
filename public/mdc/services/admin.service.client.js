(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('AdminService', AdminService);

    function AdminService($http) {

        var api = {
            "findAllUsers": findAllUsers,
            "findAllBooks": findAllBooks,
            "findAllRecipes": findAllRecipes,
            "findAllCategories": findAllCategories,
            "createUser": createUser,
            "createBook": createBook,
            "createRecipe": createRecipe,
            "createCategory": createCategory,
            "updateUser": updateUser,
            "updateCategory": updateCategory,
            "deleteUser": deleteUser,
            "deleteCategory": deleteCategory,
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

        function findAllCategories() {
            return $http.get("/api/admin/categories");
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

        function createCategory(category) {
            return $http.post('/api/category', category);
        }

        function updateUser(uid, user) {
            return $http.put('/api/admin/user/' + uid, user);
        }

        function updateCategory(cid, category) {
            return $http.put('/api/category/' + cid, category);
        }

        function deleteUser(uid) {
            return $http.delete('/api/admin/user/' + uid);
        }

        function deleteCategory(cid) {
            return $http.delete('/api/category/' + cid);
        }

    }
})();