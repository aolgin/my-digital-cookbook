module.exports = function(app, model) {
    var NotificationModel = model.notificationModel;
    var mongoose = require('mongoose');

    app.get("/api/user/:uid/notification", findUserFeed);
    app.get("/api/notification/:nid", findNotificationById);
    app.post("/api/user/:uid/notification", createNotification);
    app.delete("/api/notification/:nid", checkAdmin, deleteNotification);
    app.get("/api/admin/notifications", checkAdmin, listAllNotifications);

    // Helper Functions
    function checkAdmin(req, res, next) {
        if(req.user && req.user.role === 'ADMIN') {
            next();
        } else {
            res.sendStatus(401);
        }
    }

    // Service Functions

    // A function to look for notifications for all users within the given array
    function findUserFeed(req, res) {
        var uid = req.params['uid'];
        var limit = req.query['limit'];
        model.userModel
            .findFollowing(uid)
            .then(function(following) {
                NotificationModel.findNotificationsForUsers(following, limit)
                    .then(function (results) {
                        res.json(results);
                    }, function (err) {
                        console.log(err);
                        res.sendStatus(500);
                    });
            }).catch(function (err) {
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
        NotificationModel.removeNotification(nid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

};