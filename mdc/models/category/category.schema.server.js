module.exports = function () {
    var mongoose = require("mongoose");
    var CategorySchema = mongoose.Schema({
        name: {type: String, unique: true, dropDups: true }
    }, {collection: "category",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return CategorySchema;
};