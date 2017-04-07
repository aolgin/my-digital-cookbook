module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var RecipeSchema = require("./recipe.schema.server")();
    var RecipeModel  = mongoose.model("RecipeModel", RecipeSchema);

    var api = {
        createRecipe: createRecipe,
        findRecipeById: findRecipeById,
        findBooksWithRecipe: findBooksWithRecipe,
        updateRecipe: updateRecipe,
        removeRecipe: removeRecipe,
        findAllRecipes: findAllRecipes,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function findAllRecipes() {
        return RecipeModel.find();
    }

    function findBooksWithRecipe(rid) {

    }

    function removeRecipe(uid) {
        return RecipeModel.remove({_id: uid});
    }

    function updateRecipe(bid, recipe) {
        return RecipeModel.update({ _id: bid },
            {
                name: recipe.name,
                description: recipe.description
            }
        );
    }

    function findRecipeById(bid) {
        return RecipeModel.findById(bid);
    }

    function createRecipe(recipe) {
        return RecipeModel.create(recipe);
    }
};