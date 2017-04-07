(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('UserService', userService);

    function userService($http) {

        var api = {
            // "registerUser": registerUser,
            "deleteUser": deleteUser,
            "updateUser": updateUser,
            "updatePassword": updatePassword,
            "findUserById": findUserById,
            // "findUserByCredentials": findUserByCredentials,
            "findRecipesByUserId": findRecipesByUserId,
            "findBooksByUserId": findBooksByUserId,
            "findUserFavorites": findUserFavorites,
            "login": login,
            "logout": logout,
            "register": register,
            "loggedin": loggedin
        };
        return api;

        function logout(user) {
            return $http.post("/api/logout");
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function loggedin(user) {
            return $http.get('/api/user?username=' + user.username);
        }

        function findRecipesByUserId(uid) {
            return $http.get("/api/user/" + uid + "/recipe");
        }

        function findUserFavorites(uid) {
            return $http.get("/api/user/" + uid + "/favorites");
        }

        function findBooksByUserId(uid) {
            return $http.get("/api/user/" + uid + "/book");
        }

        function findUserById(uid) {
            return $http.get("/api/user/" + uid);
        }

        // function findUserByCredentials(email, pass) {
        //     return $http.get("/api/user?email=" + email + "&password=" + pass);
        // }
        //
        // function registerUser(user) {
        //     return $http.post("/api/user/", user);
        // }

        function deleteUser(uid) {
            return $http.delete("/api/user/" + uid);
        }

        function updateUser(uid, newUser) {
            return $http.put("/api/user/" + uid, newUser);
        }

        function updatePassword(uid, passwords) {
            return $http.put("/api/user/" + uid, passwords);
        }
    }
})();