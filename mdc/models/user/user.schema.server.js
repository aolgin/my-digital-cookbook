module.exports = function() {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        password: String,
        firstName: String,
        lastName: String,
        username: {type: String, unique: true, dropDups: true },
        books: [{type: mongoose.Schema.Types.ObjectId, ref:'BookModel'}],
        recipes: [{type: mongoose.Schema.Types.ObjectId, ref:'RecipeModel'}],
        about: String,
        role: {type: String, enum: ['ADMIN', 'USER'], default: 'USER'},
        following: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        follower_count: {type: Number, default: 0},
        google: {
            id: String,
            token: String
        }
    }, {collection: "user",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return UserSchema;
};