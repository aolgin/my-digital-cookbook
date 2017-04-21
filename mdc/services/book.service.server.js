module.exports = function(app, model) {
    var bookModel = model.bookModel;

    var auth = authorized;

    app.get("/api/user/:uid/book", findBooksByUser);
    app.post("/api/user/:uid/book", auth, createBook);
    app.get("/api/book/search", searchBooks);
    app.get("/api/book/:bid", findBookById);
    app.delete("/api/book/:bid", checkSameUser, deleteBook);
    app.put("/api/book/:bid", checkSameUser, updateBook);
    app.delete("/api/admin/book/:bid", checkAdmin, deleteBook);
    app.post("/api/admin/book", checkAdmin, createBook);
    app.put("/api/admin/book/:bid", checkAdmin, updateBook);
    app.get("/api/admin/books", checkAdmin, findAllBooks);

    // Helper functions

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    function checkSameUser(req, res, next) {
        bookModel.findBookById(req.params['bid'])
            .then(function (book) {
                if (req.user && String(req.user._id) == String(book._user._id)) {
                    next();
                } else {
                    res.sendStatus(401);
                }
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function checkAdmin(req, res, next) {
        if(req.user && req.user.role === 'ADMIN') {
            next();
        } else {
            res.sendStatus(401);
        }
    }

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

        model.userModel.findBooksForUser(uid, limit)
            .then(function (user) {
                var books = user.books;
                for (var i = 0; i < books.length; i++) {
                    books[i].description = books[i].description.substring(0, 25);
                }
                res.json(user.books);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function createBook(req, res) {
        var newBook = req.body;
        var uid = req.params['uid'] || newBook._user._id;

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