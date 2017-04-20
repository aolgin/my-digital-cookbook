module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var BookSchema = require("./book.schema.server")();
    var BookModel  = mongoose.model("BookModel", BookSchema);

    var api = {
        createBook: createBook,
        findBookById: findBookById,
        findRecipesForBook: findRecipesForBook,
        updateBook: updateBook,
        removeBook: removeBook,
        removeBooksForUser: removeBooksForUser,
        removeRecipeFromBook: removeRecipeFromBook,
        removeRecipeFromAllBooks: removeRecipeFromAllBooks,
        findAllBooks: findAllBooks,
        searchBooks: searchBooks,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function searchBooks(term) {
        var re = new RegExp(term, 'i');
        return BookModel
            .find()
            .or([
                { 'name': { $regex: re }},
                { 'description': { $regex: re }}
            ])
            .select("name description _user")
            .populate("_user", "username")
            .sort({'dateModified': 1})
            .exec();
    }

    function removeBooksForUser(user) {
        return BookModel.remove({_user: user});
    }

    function findAllBooks() {
        return BookModel
            .find()
            .populate("_user", "_id username")
            .populate("recipes", "_id name")
            .exec();
    }

    function removeRecipeFromAllBooks(recipeObj) {
        //TODO: Test that this works...
        return BookModel.update(
            {recipes: {$elemMatch: recipeObj}},
            {$pullAll: {recipes: [recipeObj]}}
        );
    }

    function removeRecipeFromBook(recipe) {
        // Is just temporary for now
        var bid = recipe._book; //TODO: due to the many to many relationship here, this will not work like this.
        return BookModel.findById(bid)
            .then(function (bookObj) {
                bookObj.recipes.pull(recipe);
                return bookObj.save();
            }, function (err) {
                console.log(err);
            });
    }

    function removeBook(bid) {
        /*
        Needs to delete:
        - book itself
        - book from user - ✓
        - detach recipes in this book (don't delete though!)
         */
        return BookModel.findById(bid)
            .then(function (bookObj) {
                model.userModel
                    .removeBookFromUser(bookObj)
                    .then(function (response) {
                        // // Seems to be what's causing a hold-up here
                        // model.recipeModel
                        //     .detachRecipesFromBook(bookObj)
                        //     .then(function (response) {
                        return BookModel.remove({_id: bid});
                    }, function (err) {
                        console.log(err);
                    })
                    // })
            });
    }

    function findRecipesForBook(userId, limit) {
        return BookModel
            .findById(userId)
            .populate({
                path: "recipes",
                options: {limit: limit, sort: { 'dateCreated': -1 } },
                populate: { path: "rating" }
            })
            .exec();
    }

    function updateBook(bid, book) {
        return BookModel.update({ _id: bid },
            {
                name: book.name,
                description: book.description
            }
        );
    }

    function findBookById(bid) {
        return BookModel
            .findById(bid)
            .populate("recipes", "name _user _id")
            .populate("_user", "username _id")
            .exec();
    }

    function createBook(userId, book) {
        return BookModel
            .create(book)
            .then(function(bookObj){
                model.userModel
                    .findUserById(userId)
                    .then(function(userObj) {
                        bookObj._user = userObj._id;
                        bookObj.save();
                        userObj.books.push(bookObj);
                        return userObj.save();
                    })
            }).catch(function (err) {
                console.log(err);
            });
    }
};