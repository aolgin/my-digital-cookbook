module.exports = function () {
    var mongoose = require("mongoose");
    var NotificationSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
        description: String
    }, {collection: "notification",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return NotificationSchema;
};