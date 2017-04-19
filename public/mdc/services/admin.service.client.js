(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('AdminService', AdminService);

    function AdminService($http) {

        var api = {
            "findAllUsers": findAllUsers,
            "findAllBooks": findAllBooks,
            "findAllRecipes": findAllRecipes,
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
    }
})();