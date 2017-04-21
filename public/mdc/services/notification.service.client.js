(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('NotificationService', notificationService);

    function notificationService($http) {

        var api = {
            "findNotificationById": findNotificationById,
            "findNotificationsByUser": findNotificationsByUser,
            "createNotification": createNotification,
            "deleteNotification": deleteNotification,
            "findUserFeed": findUserFeed,
            "listAllNotifications": listAllNotifications
        };
        return api;


        function findUserFeed(uid) {
            return $http.get("/api/user/" + uid + "/notification");
        }

        function findNotificationById(nid) {
            return $http.get("/api/notification/" + nid);
        }

        function findNotificationsByUser(uid) {
            return $http.get("/api/user/" + uid + "/notification");
        }

        function createNotification(uid, text) {
            return $http.post("/api/user/" + uid + "/notification", text);
        }

        function deleteNotification(nid) {
            return $http.delete("/api/notification/" + nid);
        }

        function listAllNotifications() {
            return $http.get("/api/admin/notifications");
        }
    }
})();