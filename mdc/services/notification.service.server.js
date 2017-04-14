module.exports = function(app, model) {
    var NotificationModel = model.notificationModel;

    app.get("/api/notification/:nid", findNotificationById);
    app.get("/api/user/:uid/notification", findNotificationsByUser);
    app.get("/api/notification", findNotificationsForUsers);
    app.post("/api/user/:uid/notification", createNotification);
    app.delete("/api/notification/:nid", deleteNotification);
    app.get("/api/admin/notifications", listAllNotifications);

    // Service Functions

    // A function to look for notifications for all users within the given array
    function findNotificationsForUsers(req, res) {
        var users = req.body;

        NotificationModel.findNotificationsForUsers(users)
            .then(function(results) {
                res.json(results);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })

    }

    function findNotificationById(req, res) {
        var nid = req.params['nid'];
        NotificationModel.findNotificationById(nid)
            .then(function (notifyObj) {
                res.json(notifyObj);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function listAllNotifications(req, res) {
        NotificationModel.findAllNotifications()
            .then(function(notifications) {
                res.json(notifications);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function findNotificationsByUser(req, res) {
        var uid = req.params['uid'];
        NotificationModel.findNotificationsByUser(uid)
            .then(function (results) {
                res.json(results);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function createNotification(req, res) {
        var uid = req.params['uid'];
        var notification = req.body;
        NotificationModel.createNotification(uid, notification)
            .then(function(notifyObj) {
                res.json(notifyObj);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function deleteNotification(req, res) {
        var nid = req.params['nid'];
        NotificationModel.deleteNotification(nid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

};