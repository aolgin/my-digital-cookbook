module.exports = function () {
    var mongoose = require("mongoose");
    var RecipeSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
        books: [{type: mongoose.Schema.Types.ObjectId, ref: "BookModel"}],
        name: String,
        description: String
    }, {collection: "recipe",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return RecipeSchema;
};