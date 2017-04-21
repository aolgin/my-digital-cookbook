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
            .sort({"dateModified": -1})
            .exec();
    }

    function removeRecipeFromAllBooks(recipeObj) {
        return BookModel.update(
            {recipes: {$elemMatch: recipeObj}},
            {$pullAll: {recipes: [recipeObj]}}
        );
    }

    function removeBook(bid) {
        return BookModel.findById(bid)
            .then(function (bookObj) {
                model.recipeModel
                    .detachRecipesFromBook(bookObj)
                    .then(function (response) {
                        model.userModel
                            .removeBookFromUser(bookObj)
                            .then(function (response) {
                                BookModel
                                    .remove({_id: bid})
                                    .then(function (response) {
                                        return model.notificationModel
                                            .createNotification(bookObj._user, "deleted book: " + bookObj.name);
                                    })
                            })
                    })
            }).catch(function (err) {
                console.log(err);
            });
    }

    function findRecipesForBook(userId, limit) {
        return BookModel
            .findById(userId)
            .populate({
                path: "recipes",
                options: {limit: limit, sort: { 'dateModified': -1 } },
                populate: { path: "rating" }
            })
            .sort({"dateModified": -1})
            .exec();
    }

    function updateBook(bid, book) {
        return BookModel.update({ _id: bid },
            {
                name: book.name,
                description: book.description
            })
            .then(function (response) {
                return model.notificationModel
                    .createNotification(book._user, "updated book: " + book.name);
            })
    }

    function findBookById(bid) {
        return BookModel
            .findById(bid)
            .populate({
                path: "recipes",
                select: "name description _user _id",
                options: { sort: { dateModified: -1 }}
            })
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
                        userObj.save();
                        return model.notificationModel
                            .createNotification(userId, "created book: " + book.name);
                    })
            }).catch(function (err) {
                console.log(err);
            });
    }
};