module.exports = function() {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        username: {type: String, unique: true, dropDups: true },
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        books: [{type: mongoose.Schema.Types.ObjectId, ref:'BookModel'}],
        recipes: [{type: mongoose.Schema.Types.ObjectId, ref:'RecipeModel'}]
    }, {collection: "user",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return UserSchema;
};