module.exports = function () {
    var mongoose = require("mongoose");
    var BookSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
        name: String,
        description: String,
        image_url: String,
        recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModel'}]
    }, {collection: "book",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return BookSchema;
};