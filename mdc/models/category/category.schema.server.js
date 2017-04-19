module.exports = function () {
    var mongoose = require("mongoose");
    var CategorySchema = mongoose.Schema({
        name: {type: String, unique: true, dropDups: true },
        recipes: [{type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel"}] // TODO: perhaps unnecessary. Is easy to just do a find({category: "cat"})
    }, {collection: "category",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return CategorySchema;
};