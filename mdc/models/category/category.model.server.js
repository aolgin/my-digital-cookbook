module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var CategorySchema = require("./category.schema.server")();
    var CategoryModel = mongoose.model("CategoryModel", CategorySchema);

    var api = {
        createCategory: createCategory,
        applyCategoryToRecipe: applyCategoryToRecipe,
        detachCategoryFromRecipe: detachCategoryFromRecipe,
        removeCategory: removeCategory,
        updateCategory: updateCategory,
        findCategoryById: findCategoryById,
        findAllCategories: findAllCategories,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function updateCategory(cid, newCat) {
        return CategoryModel.update(
            {_id: cid},
            {name: newCat.name}
        );
    }

    function createCategory(newCat) {
        return CategoryModel.create(newCat);
    }

    function applyCategoryToRecipe(cid, rid) {
        return model.recipeModel
            .findRecipeById(rid)
            .then(function (recipeObj) {
                CategoryModel.findCategoryById(cid)
                    .then(function (catObj) {
                        recipeObj.categories.push(catObj);
                        return recipeObj.save();
                    });
            })
    }

    function detachCategoryFromRecipe(cid, rid) {
        return model.recipeModel
            .findRecipeById(rid)
            .then(function (recipeObj) {
                CategoryModel.findCategoryById(cid)
                    .then(function (catObj) {
                        recipeObj.categories.pull(catObj);
                        return recipeObj.save();
                    })
            });
    }

    function removeCategory(cid) {
        // TODO: incorporate detachment here as well
        return CategoryModel.remove({_id: cid});
    }

    function findCategoryById(cid) {
        return CategoryModel.findById(cid);
    }

    function findAllCategories() {
        return CategoryModel.find();
    }

};