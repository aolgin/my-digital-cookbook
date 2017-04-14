(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('NotificationService', notificationService);

    function notificationService($http) {

        var api = {
            "findNotificationById": findNotificationById,
            "findNotificationsByUser": findNotificationsByUser,
            "findNotificationsForUsers": findNotificationsForUsers,
            "createNotification": createNotification,
            "deleteNotification": deleteNotification,
            "listAllNotifications": listAllNotifications
        };
        return api;

        function findNotificationById(nid) {
            return $http.get("/api/notification/" + nid);
        }

        function findNotificationsByUser(uid) {
            return $http.get("/api/user/" + uid + "/notification");
        }

        function findNotificationsForUsers(users) {
            return $http.get("/api/notification", users);
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