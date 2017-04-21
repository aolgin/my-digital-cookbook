module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var NotificationSchema = require("./notification.schema.server")();
    var NotificationModel = mongoose.model("NotificationModel", NotificationSchema);

    var api = {
        createNotification: createNotification,
        removeNotification: removeNotification,
        findNotificationsByUser: findNotificationsByUser,
        findNotificationsForUsers: findNotificationsForUsers,
        findNotificationById: findNotificationById,
        findAllNotifications: findAllNotifications,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function findNotificationsForUsers(users, limit) {
        return NotificationModel
            .find(
                {"_user": {$in: users}}
            )
            .populate("_user", "_id username")
            .sort({ dateCreated: -1 })
            .limit(limit)
            .exec();
    }


    function findNotificationsByUser(uid) {
        // Need to verify that this works properly. May need to grab the userobj first
        // NOTE: Not in use at the moment
        return NotificationModel.find({_user: uid});
    }

    function createNotification(uid, description) {
        var notification = {
            description: description
        };
        return NotificationModel.create(notification)
            .then(function (notifyObj) {
                model.userModel.findUserById(uid)
                    .then(function (userObj) {
                        notifyObj._user = userObj._id;
                        return notifyObj.save();
                    }, function (err) {
                        console.log(err);
                    })
            })
    }

    function findAllNotifications() {
        return NotificationModel
            .find()
            .populate("_user", "_id username")
            .sort({"dateModified": -1})
            .exec();
    }

    function removeNotification(nid) {
        return NotificationModel.remove({_id: nid});
    }

    function findNotificationById(nid) {
        return NotificationModel.findById(nid);
    }
};