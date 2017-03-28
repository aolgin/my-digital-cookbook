module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var UserSchema = require("./user.schema.server")();
    var UserModel  = mongoose.model("UserModel", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findBooksForUser: findBooksForUser,
        findRecipessForUser: findRecipesForUser,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        removeUser: removeUser,
        removeBookFromUser: removeBookFromUser,
        updatePassword: updatePassword,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function removeBookFromUser(book) {
        var uid = book._user;
        return UserModel.findById(uid)
            .then(function (userObj) {
                userObj.books.pull(book);
                return userObj.save();
            }, function (err) {
                console.log(err);
            });
    }

    function removeUser(uid) {
        return UserModel.remove({_id: uid});
    }

    function findRecipesForUser(userId) {
        return UserModel
            .findById(userId)
            .populate("recipes")
            .exec();
    }

    function findBooksForUser(userId) {
        return UserModel
            .findById(userId)
            .populate("books")
            .exec();
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({
            username: username,
            password: password
        });
    }


    function findUserByUsername(username) {
        return UserModel.findOne({ username: username });
    }

    function updateUser(userId, user) {
        return UserModel.update({ _id: userId },
            {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        );
    }

    function updatePassword(userId, password) {
        return UserModel.update({ _id: userId },
            {
                password: password
            }
        );
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function createUser(user) {
        return UserModel.create(user);
    }
};