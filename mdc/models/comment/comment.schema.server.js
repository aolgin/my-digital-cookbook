module.exports = function () {
    var mongoose = require("mongoose");
    var CommentSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
        rating: Number,
        text: String,
        _recipe: {type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel"}
    }, {collection: "comment",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return CommentSchema;
};