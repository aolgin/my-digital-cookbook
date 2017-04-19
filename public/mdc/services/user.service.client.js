(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('UserService', userService);

    function userService($http) {

        var api = {
            "deleteUser": deleteUser,
            "updateUser": updateUser,
            "updatePassword": updatePassword,
            "findUserById": findUserById,
            "findRecipesByUserId": findRecipesByUserId,
            "findBooksByUserId": findBooksByUserId,
            "findFollowingByUserId": findFollowingByUserId,
            "followUser": followUser,
            "unfollowUser": unfollowUser,
            "isFollowingChef": isFollowingChef,
            "login": login,
            "logout": logout,
            "register": register,
            "loggedin": loggedin
        };
        return api;

        function isFollowingChef(uid, chefId) {
            return $http.get("/api/user/" + uid + "/follow/" + chefId);
        }

        function followUser(followerId, followingId) {
            return $http.put("/api/user/" + followerId + "/follow/?followingId=" + followingId);
        }

        function unfollowUser(followerId, followingId) {
            return $http.delete("/api/user/" + followerId + "/follow/?followingId=" + followingId);
        }

        function findFollowingByUserId(uid) {
            return $http.get("/api/user/" + uid + "/follow");
        }

        function logout(user) {
            return $http.post("/api/logout");
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function loggedin() {
            return $http.get('/api/loggedin');
        }

        function findRecipesByUserId(uid, limit) {
            return $http.get("/api/user/" + uid + "/recipe?limit=" + limit);
        }

        function findBooksByUserId(uid, limit) {
            return $http.get("/api/user/" + uid + "/book?limit=" + limit);
        }

        function findUserById(uid) {
            return $http.get("/api/user/" + uid);
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