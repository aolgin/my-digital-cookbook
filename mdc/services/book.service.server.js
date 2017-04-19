module.exports = function(app, model) {
    var bookModel = model.bookModel;

    app.get("/api/user/:uid/book", findBooksByUser);
    app.post("/api/user/:uid/book", createBook);
    app.get("/api/book/search", searchBooks);
    app.get("/api/book/:bid", findBookById);
    app.delete("/api/book/:bid", deleteBook);
    app.put("/api/book/:bid", updateBook);
    app.get("/api/admin/books", findAllBooks);

    // Service Functions

    function findAllBooks(req, res) {
        bookModel.findAllBooks()
            .then(function (books) {
                res.json(books);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function searchBooks(req, res) {
        var term = req.query['term'];
        bookModel.searchBooks(term)
            .then(function(response) {
                if (response.length > 0) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findBooksByUser(req, res) {
        var uid = req.params['uid'];
        var limit = req.query['limit'];

        // var userBooks = books.filter(function(r) {
        //     return r._user = uid;
        // });
        //
        // res.json(userBooks);

        model.userModel.findBooksForUser(uid, limit)
            .then(function (user) {
                var books = user.books;
                for (var i = 0; i < books.length; i++) {
                    books[i].description = books[i].description.substring(0, 50);
                }
                res.json(user.books);
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