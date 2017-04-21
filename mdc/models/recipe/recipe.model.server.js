module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var RecipeSchema = require("./recipe.schema.server")();
    var RecipeModel  = mongoose.model("RecipeModel", RecipeSchema);

    var api = {
        createRecipe: createRecipe,
        createRecipeInBook: createRecipeInBook,
        createRecipeInBooks: createRecipeInBooks,
        findRecipeById: findRecipeById,
        findBooksWithRecipe: findBooksWithRecipe,
        updateRecipe: updateRecipe,
        removeRecipe: removeRecipe,
        searchRecipes: searchRecipes,
        searchRecipesByCategory: searchRecipesByCategory,
        findAllRecipes: findAllRecipes,
        rateRecipe: rateRecipe,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function searchRecipes(term) {
        var re = new RegExp(term, 'i');
        return RecipeModel
            .find()
            .or([
                { 'name': { $regex: re }},
                { 'description': { $regex: re }},
                { 'ingredients': { $regex: re }},
                { 'directions': { $regex: re }}
            ])
            .select("name description img_record rating _user")
            .populate("rating", "actual")
            .populate("_user", "username")
            .populate("img_record", "url")
            .sort({'dateModified': 1})
            .exec();
    }

    function searchRecipesByCategory(term) {
        var re = new RegExp(term, 'i');
        return RecipeModel
            .find({
                category: { $regex: re }
            })
            .select("-_id name description img_record rating _user")
            .populate("rating", "actual")
            .populate("_user", "username")
            .sort({'dateModified': 1})
            .exec();
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

    function createRecipeInBook(uid, bid, recipe) {
        return RecipeModel
            .create(recipe)
            .then(function(recipeObj){
                model.userModel
                    .findUserById(uid)
                    .then(function(userObj){
                        model.bookModel.findBookById(bid)
                            .then(function (bookObj) {
                                recipeObj._user = userObj._id;
                                recipeObj.books.push(bookObj);
                                recipeObj.save();
                                bookObj.recipes.push(recipeObj);
                                bookObj.save();
                                userObj.recipes.push(recipeObj);
                                return userObj.save();
                            });
                    }, function(error){
                        console.log(error);
                    });
            });
    }

    function createRecipe(uid, recipe) {
        if (recipe.books) {
            createRecipeInBooks(recipe);
        } else {
            return RecipeModel
                .create(recipe)
                .then(function(recipeObj){
                    model.userModel
                        .findUserById(uid)
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