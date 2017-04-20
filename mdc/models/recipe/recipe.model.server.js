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
        detachRecipesFromBook: detachRecipesFromBook,
        findAllRecipes: findAllRecipes,
        rateRecipe: rateRecipe,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function detachRecipesFromBook(bookObj) {
        return RecipeModel.update(
            { books:
                { $elemMatch: { _id: bookObj._id}}
            },
            { $pull: {books: bookObj}}
        );
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
            .select("name description rating _user")
            .populate("rating", "actual")
            .populate("_user", "username")
            .populate("categories", "name")
            .sort({'dateModified': 1})
            .exec();
    }

    function searchRecipesByCategory(term) {
        var re = new RegExp(term, 'i');
        return RecipeModel
            .find({
                category: { $regex: re }
            })
            .select("-_id name description rating _user")
            .populate("rating", "actual")
            .populate("categories", "name")
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
        return RecipeModel
            .find()
            .populate("_user", "_id username")
            .populate("categories", "name")
            .exec();
    }

    function findBooksWithRecipe(rid) {

    }

    // TODO determine how best to handle this
    function removeRecipe(rid) {
        return RecipeModel.findById(rid)
            .then(function (recipeObj) {
                model.commentModel
                    .removeAllCommentsFromRecipe(recipeObj)
                    .then(function (response) {
                        return model.bookModel.removeRecipeFromAllBooks(recipeObj)
                    })
                    .then(function (response) {
                        return model.userModel.removeRecipeFromUser(recipeObj)
                    })
                    .then(function (response) {
                        return RecipeModel.remove({_id: rid});
                    })
            }, function (err) {
                console.log(err);
            });
        /*
        Need to delete: ✓
        - recipe itself
        - its comments
        - its place in books
        - its place in the owning user
         */
        // return RecipeModel.remove({_id: rid});
    }

    function updateRecipe(rid, recipe) {
        return RecipeModel.update({ _id: rid },
            {
                name: recipe.name,
                description: recipe.description,
                ingredients: recipe.ingredients,
                directions: recipe.directions,
                prep_time: recipe.prep_time,
                ready_in: recipe.ready_in,
                yield: recipe.yield,
                num_servings: recipe.num_servings,
                cook_time: recipe.cook_time
            }
        );
    }

    function findRecipeById(bid) {
        return RecipeModel
            .findById(bid)
            .populate("_user", "_id username")
            .populate("categories", "name")
            .populate({
                path: "comments",
                select: "_user text rating _id dateCreated",
                populate: {
                    path: "_user",
                    select: "username _id",
                    model: "UserModel"
                }
            })
            .exec();
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