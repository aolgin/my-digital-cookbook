module.exports = function(app, model) {
    var bookModel = model.bookModel;

    app.get("/api/user/:uid/book", findBooksByUser);
    app.post("/api/user/:uid/book", createBook);
    app.get("/api/book/:bid", findBookById);
    app.delete("/api/book/:bid", deleteBook);
    app.put("/api/book/:bid", updateBook);
    app.get("/api/book/search", searchBooks);
    app.get("/api/admin/books", findAllBooks);

    // Service Functions

    var books = [
        {"_id": "1", "name": "My First Cookbook", "description": "Lorem Ipsum", "_user": "789", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/220px-Good_Food_Display_-_NCI_Visuals_Online.jpg"},
        {"_id": "2", "name": "My Second Cookbook", "description": "Lorem Ipsum", "_user": "789"},
        {"_id": "3", "name": "My Third Cookbook", "description": "Lorem Ipsum", "_user": "789"},
        {"_id": "4", "name": "My Fourth Cookbook", "description": "Lorem Ipsum", "_user": "789", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/220px-Good_Food_Display_-_NCI_Visuals_Online.jpg"},
        {"_id": "5", "name": "My Fifth Cookbook", "description": "Lorem Ipsum", "_user": "789"},
        {"_id": "6", "name": "My Sixth Cookbook", "description": "Lorem Ipsum", "_user": "789", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/220px-Good_Food_Display_-_NCI_Visuals_Online.jpg"},
        {"_id": "7", "name": "My Seventh Cookbook", "description": "Lorem Ipsum", "_user": "789"},
        {"_id": "8", "name": "My Eighth Cookbook", "description": "Lorem Ipsum", "_user": "789", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/220px-Good_Food_Display_-_NCI_Visuals_Online.jpg"}
    ];

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

        var userBooks = books.filter(function(r) {
            return r._user = uid;
        });

        res.json(userBooks);

        // model.userModel.findBooksForUser(uid)
        //     .then(function (response) {
        //         var books = response.books;
        //         for (var i = 0; i < books.length; i++) {
        //             books[i].description = books[i].description.substring(0, 50);
        //         }
        //         res.json(response.books);
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(500);
        //     });
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