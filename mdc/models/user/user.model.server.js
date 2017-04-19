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
        findUserByUsername: findUserByUsername,
        findBooksForUser: findBooksForUser,
        findRecipesForUser: findRecipesForUser,
        findUserByUsername: findUserByUsername,
        findUserByGoogleId: findUserByGoogleId,
        updateUser: updateUser,
        updateProfile: updateProfile,
        removeUser: removeUser,
        removeBookFromUser: removeBookFromUser,
        updatePassword: updatePassword,
        findAllUsers: findAllUsers,
        findFollowingByUserId: findFollowingByUserId,
        followUser: followUser,
        unfollowUser: unfollowUser,
        isFollowingChef: isFollowingChef,
        searchUsers: searchUsers,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function findUserByGoogleId(gid) {
        return UserModel.findOne({'google.id': gid});
    }

    function searchUsers(term) {
        var re = new RegExp(term, 'i');
        return UserModel
            .find()
            .or([{ 'firstName': { $regex: re }}, { 'lastName': { $regex: re }}, { 'about': { $regex: re }}, { 'username': { $regex: re }}])
            .select("img_record username firstName lastName about")
            .populate("img_record", "url")
            .sort({'username': 1})
            .exec();
    }

    function followUser(followerId, userIdToFollow) {
        return UserModel.findById(followerId)
            .then(function(follower) {
                UserModel.findById(userIdToFollow)
                    .then(function(followingUser) {
                        follower.following.addToSet(followingUser);
                        follower.save();
                        followingUser.follower_count += 1;
                        return followingUser.save();
                    })
            })
    }

    function unfollowUser(followerId, userIdToUnfollow) {
        return UserModel.findById(followerId)
            .then(function(follower) {
                UserModel.findById(userIdToUnfollow)
                    .then(function(followingUser) {
                        follower.following.pull(followingUser);
                        follower.save();
                        followingUser.follower_count -= 1;
                        return followingUser.save();
                    })
            })
    }

    function isFollowingChef(followerId) {
        // Yes, this is just an alias function for findById,
        // but unlike the findUserById, this one does not populate the
        // 'following' field, making it easier to run a check on whether the chef is in the user's following
        return UserModel.findById(followerId);
    }

    function findFollowingByUserId(uid) {
        return UserModel
            .findById(uid)
            .populate({
                path: "following",
                select: "username _id",
                options: { sort: { 'username': -1 } }
            })
            .exec();
    }

    function findAllUsers() {
        return UserModel.find();
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
        // Design choice: Deleting the user will not delete their content.
        // Individual books or recipes may be removed from their respective pages.
        return UserModel.remove({_id: uid});
    }

    function findRecipesForUser(userId, limit) {
        if (limit) {
            return UserModel
                .findById(userId)
                .populate({
                    path: "recipes",
                    select: "-_user -books",
                    options: {limit: limit, sort: { 'dateCreated': -1 } }
                })
                .exec();
        } else {
            return UserModel
                .findById(userId)
                .populate({
                    path: "recipes",
                    select: "-_user -books",
                    options: { sort: { 'dateCreated': -1 } }
                })
                .exec();
        }
        //
        // return UserModel
        //     .findById(userId)
        //     // .populate("recipes", "-books -_user")
        //     .populate({
        //         path: "recipes",
        //         select: "-_user -books",
        //         options: {limit: limit, sort: { 'dateCreated': -1 } }
        //     })
        //     .exec();
    }

    function findBooksForUser(userId, limit) {
        if (limit) {
            return UserModel
                .findById(userId)
                // .populate("books", "-_user -recipes")
                .populate({
                    path: "books",
                    select: "-_user -recipes",
                    options: {limit: limit, sort: { 'dateCreated': -1 } }
                })
                .exec();
        } else {
            return UserModel
                .findById(userId)
                .populate({
                    path: "books",
                    select: "-_user -recipes",
                    options: { sort: { 'dateCreated': -1 } }
                })
                .exec();
        }

    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({
            username: username,
            password: password
        });
    }


    function findUserByUsername(uname) {
        return UserModel.findOne({ username: uname });
    }

    function updateProfile(userId, user) {
        return UserModel.update({ _id: userId },
            {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                about: user.about
            }
        );
    }

    function updateUser(userId, user) {
        if (!user.role) user.role = 'USER';
        return UserModel.update({ _id: userId },
            {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                about: user.about,
                password: password,
                role: user.role
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
        return UserModel
            .findById(userId)
            .populate("books", "name")
            .populate("recipes", "name")
            .populate("following", "username")
            .exec();
    }

    function createUser(user) {
        return UserModel.create(user);
    }
};