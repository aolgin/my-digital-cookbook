module.exports = function () {
    var mongoose = require("mongoose");
    var RecipeSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
        books: [{type: mongoose.Schema.Types.ObjectId, ref: "BookModel"}],
        name: String,
        description: String,
        ingredients: String,
        directions: String,
        prep_time: String,
        img_record: {type: mongoose.Schema.Types.ObjectId, ref: "FileModel"},
        ready_in: String,
        yield: String,
        num_servings: String, // UNSURE
        cook_time: String,
        rating: {
            count: {type: Number, default: 0},
            total: {type: Number, default: 0},
            actual: Number
        }
    }, {collection: "recipe",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return RecipeSchema;
};