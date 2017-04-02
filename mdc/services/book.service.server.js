module.exports = function(app, model) {
    var bookModel = model.bookModel;

    app.get("/api/user/:uid/book", findBooksByUser);
    app.post("/api/user/:uid/book", createBook);
    app.get("/api/book/:bid", findBookById);
    app.delete("/api/book/:bid", deleteBook);
    app.put("/api/book/:bid", updateBook);
    app.get("/api/book/search", searchBooks);

    // Service Functions

    function searchBooks(req, res) {
        var term = req.query['term'];
        console.log("Searching for books matching: " + term);
        // bookModel.searchBooks(term)
        //     .then(function(response) {
        //         res.json(response);
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(404);
        //     });
    }

    function findBooksByUser(req, res) {
        var uid = req.params['uid'];

        model.userModel.findBooksForUser(uid)
            .then(function (response) {
                res.json(response.books);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function createBook(req, res) {
        var newBook = req.body;
        var uid = req.params['uid'];

        bookModel.createBook(uid, newBook)
            .then(function (book) {
                res.json(book);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findBookById(req, res) {
        var bid = req.params['bid'];

        bookModel
            .findBookById(bid)
            .then(function (book) {
                if (book) {
                    res.json(book);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function updateBook(req, res) {
        var newBook = req.body;
        var bid = req.params['bid'];

        bookModel.updateBook(bid, newBook)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function deleteBook(req, res) {
        var bid = req.params['bid'];

        bookModel
            .removeBook(bid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }
};