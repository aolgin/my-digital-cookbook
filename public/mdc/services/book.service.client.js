(function() {
    angular
        .module("MyDigitalCookbook")
        .factory('BookService', bookService);

    function bookService($http) {

        var api = {
            "findBooksByUserId": findBooksByUserId,
            "createBook": createBook,
            "deleteBook": deleteBook,
            "updateBook": updateBook,
            "findBookById": findBookById
        };
        return api;

        function findBookById(bid) {
            return $http.get("/api/book/" + bid);
        }

        function findBooksByUserId(uid) {
            return $http.get("/api/user/" + uid + "/book");
        }

        function createBook(book, uid) {
            return $http.post("/api/user/" + uid + "/book", book);
        }

        function deleteBook(bid) {
            return $http.delete("/api/book/" + bid);
        }

        function updateBook(bid, newBook) {
            return $http.put("/api/book/" + bid, newBook);
        }
    }
})();