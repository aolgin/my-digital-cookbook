module.exports = function() {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        displayName: String,
        password: String,
        firstName: String,
        lastName: String,
        email: {type: String, unique: true, dropDups: true },
        books: [{type: mongoose.Schema.Types.ObjectId, ref:'BookModel'}],
        recipes: [{type: mongoose.Schema.Types.ObjectId, ref:'RecipeModel'}],
        about: String,
        favorites: [{type: mongoose.Schema.Types.ObjectId, ref:'RecipeModel'}],
        profile_pic: String, // id of photo
        photos: [String],
        friends: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}] // hopefully this doesn't cause an infinite loop
    }, {collection: "user",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return UserSchema;
};