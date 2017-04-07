module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var RecipeSchema = require("./recipe.schema.server")();
    var RecipeModel  = mongoose.model("RecipeModel", RecipeSchema);

    var api = {
        createRecipe: createRecipe,
        createRecipeInBooks: createRecipeInBooks,
        findRecipeById: findRecipeById,
        findBooksWithRecipe: findBooksWithRecipe,
        updateRecipe: updateRecipe,
        removeRecipe: removeRecipe,
        findAllRecipes: findAllRecipes,
        rateRecipe: rateRecipe,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function rateRecipe(rid, rating) {
        return RecipeModel.findById(rid)
            .then(function (recipe) {
                var newTotal = rating + recipe.rating.total;
                var newCount = recipe.rating.count + 1;
                var newActual = newTotal / newCount;
                // TODO: May not actually work as expected. Need to test.
                RecipeModel.update(
                    { _id: rid },
                    { rating: {
                        count: newCount,
                        total: newTotal,
                        actual: newActual
                        }
                    }
                )
            })
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

    function createRecipeInBooks(recipe) {
        console.log("Create recipe in books. Will write this later");
    }

    function createRecipe(recipe) {
        if (recipe.books) {
            createRecipeInBooks(recipe);
        } else {
            return RecipeModel
                .create(recipe)
                .then(function(recipeObj){
                    model.userModel
                        .findUserById(userId)
                        .then(function(userObj){
                            recipeObj._user = userObj._id;
                            recipeObj.save();
                            userObj.recipes.push(recipeObj);
                            return userObj.save();
                        }, function(error){
                            console.log(error);
                        });
                });
        }
    }
};