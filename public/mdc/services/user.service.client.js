(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('UserService', userService);

    function userService($http) {

        var api = {
            "createUser": createUser,
            "deleteUser": deleteUser,
            "updateUser": updateUser,
            "updatePassword": updatePassword,
            "findUserById": findUserById,
            "findUserByCredentials": findUserByCredentials
        };
        return api;

        function findUserById(uid) {
            return $http.get("/api/user/" + uid);
        }

        function findUserByCredentials(username, pass) {
            return $http.get("/api/user?username=" + username + "&password=" + pass);
        }

        function createUser(user) {
            return $http.post("/api/user/", user);
        }

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