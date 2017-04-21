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
            "findAllNotifications": findAllNotifications,
            "createUser": createUser,
            "createBook": createBook,
            "createRecipe": createRecipe,
            "createCategory": createCategory,
            "updateUser": updateUser,
            "updateBook": updateBook,
            "updateRecipe": updateRecipe,
            "updateCategory": updateCategory,
            "deleteUser": deleteUser,
            "deleteBook": deleteBook,
            "deleteRecipe": deleteRecipe,
            "deleteCategory": deleteCategory,
            "deleteNotification": deleteNotification,
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

        function findAllNotifications() {
            return $http.get("/api/admin/notifications");
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

        function updateBook(bid, book) {
            return $http.put('/api/admin/book/' + bid, book);
        }

        function updateRecipe(rid, recipe) {
            return $http.put('/api/admin/recipe/' + rid, recipe);
        }

        function updateCategory(cid, category) {
            return $http.put('/api/admin/category/' + cid, category);
        }

        function deleteUser(uid) {
            return $http.delete('/api/admin/user/' + uid);
        }

        function deleteBook(bid) {
            return $http.delete('/api/admin/book/' + bid);
        }

        function deleteRecipe(rid) {
            return $http.delete('/api/admin/recipe/' + rid);
        }

        function deleteCategory(cid) {
            return $http.delete('/api/admin/category/' + cid);
        }

        function deleteNotification(nid) {
            return $http.delete('/api/notification/' + nid);
        }

    }
})();