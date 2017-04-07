(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('AdminService', AdminService);

    function AdminService($http) {

        var api = {
            "findAllUsers": findAllUsers,
            "findAllBooks": findAllBooks,
            "findAllRecipes": findAllRecipes,
            "login": login,
            "logout": logout,
            "loggedin": loggedin
        };
        return api;

        function logout(user) {
            return $http.post("/api/logout");
        }

        function loggedin(user) {
            return $http.get('/api/user?username=' + user.username + "&admin=true");
        }

        function login(user) {
            return $http.post("/api/login?admin=true", user);
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