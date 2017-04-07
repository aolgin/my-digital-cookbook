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
        removeRecipeFromBook: removeRecipeFromBook,
        findAllBooks: findAllBooks,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function findAllBooks() {
        return BookModel.find();
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
        return BookModel.findById(bid)
            .then(function (bookObj) {
                model.userModel.removeBookFromUser(bookObj)
                    .then(function (response) {
                        return BookModel.remove({_id: bid});
                    }, function(err) {
                        console.log(err);
                    })
            })
        // return BookModel.remove({_id: bid});
    }

    function findRecipesForBook(userId) {
        return BookModel
            .findById(userId)
            .populate("recipes")
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
        return BookModel.findById(bid);
    }

    function createBook(userId, book) {
        return BookModel
            .create(book)
            .then(function(bookObj){
                model.userModel
                    .findUserById(userId)
                    .then(function(userObj){
                        bookObj._user = userObj._id;
                        bookObj.save();
                        userObj.books.push(bookObj);
                        return userObj.save();
                    }, function(error){
                        console.log(error);
                    });
            });
    }
};