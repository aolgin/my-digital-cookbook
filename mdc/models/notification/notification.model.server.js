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

    function findNotificationsForUsers(users) {
        // TODO need to do some thinking about how to implement this
        // http://mongoosejs.com/docs/api.html#query_Query-or
        // https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
        // http://mongoosejs.com/docs/api.html#query_Query-in
        // https://stackoverflow.com/questions/5818303/how-do-i-perform-an-id-array-query-in-mongoose
        return Notification
            .find()
            .where(_user)
            .in(users)
            .sort({ dateCreated: -1 })
            .exec();
    }

    function findNotificationsByUser(uid) {
        // TODO: verify that this works properly. May need to grab the userobj first
        return NotificationModel.find({_user: uid});
    }

    function createNotification(uid, description) {
        return NotificationModel.create(description)
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
        return NotificationModel.find();
    }

    function removeNotification(nid) {
        return NotificationModel.remove({_id: nid});
    }

    function findNotificationById(nid) {
        return NotificationModel.findById(nid);
    }
};