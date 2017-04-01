module.exports = function () {
    var mongoose = require("mongoose");
    var RecipeSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
        books: [{type: mongoose.Schema.Types.ObjectId, ref: "BookModel"}],
        name: String,
        description: String,
        ingredients: String,
        directions: String,
        prep_time: [Number, String],
        image_id: String,
        ready_in: [Number, String],
        yield: [Number, String],
        num_servings: String, // UNSURE
        cook_time: [Number, String]
    }, {collection: "recipe",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return RecipeSchema;
};