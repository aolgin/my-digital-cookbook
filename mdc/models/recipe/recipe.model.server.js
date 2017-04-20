module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var RecipeSchema = require("./recipe.schema.server")();
    var RecipeModel  = mongoose.model("RecipeModel", RecipeSchema);

    var api = {
        createRecipe: createRecipe,
        attachRecipeToBook: attachRecipeToBook,
        detachRecipeFromBook: detachRecipeFromBook,
        findRecipeById: findRecipeById,
        findBooksWithRecipe: findBooksWithRecipe,
        updateRecipe: updateRecipe,
        removeRecipe: removeRecipe,
        searchRecipes: searchRecipes,
        searchRecipesByCategory: searchRecipesByCategory,
        detachRecipesFromBook: detachRecipesFromBook,
        findAllRecipes: findAllRecipes,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function detachRecipesFromBook(bookObj) {
        return RecipeModel.updateMany(
            { books:
                {$elemMatch: {$eq: bookObj._id}}
            },
            { $pull:
                {books: bookObj._id}
            }
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
            .populate("_user", "username")
            .populate("categories", "name -_id")
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
            .populate("categories", "name")
            .populate("_user", "username")
            .sort({'dateModified': 1})
            .exec();
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

    function removeRecipe(rid) {
        return RecipeModel.findById(rid)
            .then(function (recipeObj) {
                model.commentModel
                    .removeAllCommentsFromRecipe(recipeObj)
                    .then(function (response) {
                        model.bookModel
                            .removeRecipeFromAllBooks(recipeObj)
                            .then(function (response) {
                                model.userModel
                                    .removeRecipeFromUser(recipeObj)
                                    .then(function (response) {
                                        return RecipeModel.remove({_id: rid})
                                    })
                            })
                    })
            }).catch(function(err) {
                console.log(err);
            });
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
                options: { sort: { dateCreated: -1 }},
                populate: {
                    path: "_user",
                    select: "username _id",
                    model: "UserModel"
                }
            })
            .exec();
    }

    function detachRecipeFromBook(rid, bid) {
        return RecipeModel.findById(rid)
            .then(function (recipeObj) {
                model.bookModel.findBookById(bid)
                    .then(function (bookObj) {
                        bookObj.recipes.pull(recipeObj);
                        bookObj.save();
                        recipeObj.books.pull(bookObj);
                        return recipeObj.save();
                    })
            }).catch(function (err) {
                console.log(err);
            });
    }

    function attachRecipeToBook(rid, bid) {
        return RecipeModel.findById(rid)
            .then(function (recipeObj) {
                model.bookModel.findBookById(bid)
                    .then(function (bookObj) {
                        bookObj.recipes.addToSet(recipeObj);
                        bookObj.save();
                        recipeObj.books.addToSet(bookObj);
                        return recipeObj.save();
                    })
            }).catch(function (err) {
                console.log(err);
            });
    }

    function createRecipe(uid, recipe) {
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
};