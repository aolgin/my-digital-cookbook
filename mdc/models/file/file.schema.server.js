module.exports = function () {
    var mongoose = require("mongoose");
    var FileSchema = mongoose.Schema({
        byte_size: Number,
        url: String,
        name: String,
        extension: String,
        _user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
        assoc_entity: {type: String, enum: ['USER', 'BOOK', 'RECIPE']},
        metadata: {
            extension: String,
            byte_size: Number,
            contentType: String
        }
    }, {collection: "file",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return FileSchema;
};