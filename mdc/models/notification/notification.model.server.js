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
        return NotificationModel
            .find(
                {"_user": {$in: [users]}}
            )
            .populate("_user", "_id username")
            .sort({ dateCreated: -1 })
            .exec();
    }

    /* Adam, Alice, then Test
     [ObjectId("58f99c4ef73da21e28cd2bf1"), ObjectId("58ed1f6911a9393088cc22f6"), ObjectId("58f7bd6d40428c50a4bb548c")]
     */

    function findNotificationsByUser(uid) {
        // TODO: verify that this works properly. May need to grab the userobj first
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