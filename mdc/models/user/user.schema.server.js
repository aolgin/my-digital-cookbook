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
        favorites: [{type: mongoose.Schema.Types.ObjectId, ref:'RecipeModel'}],
        image_url: String, // url of photo
        photos: [String],
        role: {type: String, enum: ['ADMIN', 'USER'], default: 'USER'},
        friends: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}] // hopefully this doesn't cause an infinite loop
    }, {collection: "user",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return UserSchema;
};