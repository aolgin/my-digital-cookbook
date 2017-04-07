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

    }

    function removeBook(uid) {
        return BookModel.remove({_id: uid});
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

    function createBook(book) {
        return BookModel.create(book);
    }
};