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
        findRecipesForUser: findRecipesForUser,
        findUserByUsername: findUserByUsername,
        findUserByGoogleId: findUserByGoogleId,
        updateUser: updateUser,
        updateProfile: updateProfile,
        removeUser: removeUser,
        removeBookFromUser: removeBookFromUser,
        removeRecipeFromUser: removeRecipeFromUser,
        updatePassword: updatePassword,
        findAllUsers: findAllUsers,
        findFollowingByUserId: findFollowingByUserId,
        followUser: followUser,
        unfollowUser: unfollowUser,
        isFollowingChef: isFollowingChef,
        findFollowing: findFollowing,
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
            .select("username firstName lastName about")
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
                        followingUser.save();
                        return model.notificationModel
                            .createNotification(followerId, "started following user: " + followingUser.username);
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
                        followingUser.save();
                        return model.notificationModel
                            .createNotification(followerId, "stopped following user: " + followingUser.username);
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
                options: { sort: { 'username': 1 } }
            })
            .exec();
    }

    function findAllUsers() {
        return UserModel
            .find()
            .populate("books", "_id name")
            .populate("recipes", "_id name")
            .sort({"dateModified": -1})
            .exec();
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

    function removeRecipeFromUser(recipe) {
        return UserModel.findById(recipe._user)
            .then(function (userObj) {
                userObj.recipes.pull(recipe);
                return userObj.save();
            }, function (err) {
                console.log(err);
            });
    }

    function removeUser(uid) {
        // Design choice: Deleting the user will only delete their books. Their recipes remain.
        // Recipes may be removed from the admin console.
        return UserModel
            .findById(uid)
            .then(function (userObj) {
                model.bookModel
                    .removeBooksForUser(userObj)
                    .then(function(response) {
                        return UserModel.remove({_id: uid});
                    })
            }).catch(function(err) {
                console.log(err);
            });
    }

    function findRecipesForUser(userId, limit) {
        if (limit) {
            return UserModel
                .findById(userId)
                .populate({
                    path: "recipes",
                    select: "-_user -books",
                    options: {limit: limit, sort: { 'dateModified': -1 } }
                })
                .exec();
        } else {
            return UserModel
                .findById(userId)
                .populate({
                    path: "recipes",
                    select: "-_user -books",
                    options: { sort: { 'dateModified': -1 } }
                })
                .exec();
        }
    }

    function findBooksForUser(userId, limit) {
        if (limit) {
            return UserModel
                .findById(userId)
                .populate({
                    path: "books",
                    select: "-_user -recipes",
                    options: {limit: limit, sort: { 'dateModified': -1 } }
                })
                .exec();
        } else {
            return UserModel
                .findById(userId)
                .populate({
                    path: "books",
                    select: "-_user -recipes",
                    options: { sort: { 'dateModified': -1 } }
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

    function updateProfile(userId, user) {
        return UserModel.update({ _id: userId },
            {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                about: user.about
            })
            .then(function(response) {
                return model.notificationModel
                    .createNotification(userId, "updated their user profile");
            });
    }

    function updateUser(userId, user) {
        if (!user.role) user.role = 'USER';
        return UserModel.update({ _id: userId },
            {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                about: user.about,
                password: user.password,
                role: user.role
            });
    }

    function updatePassword(userId, password) {
        return UserModel.update({ _id: userId },
            {
                password: password
            }
        );
    }

    function findFollowing(uid) {
        var deferred = q.defer();
        UserModel
            .findById(uid, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data.following);
                }
            });
        return deferred.promise;
    }

    function findUserById(userId) {
        return UserModel
            .findById(userId)
            .populate({
                path: "books",
                select: "name description",
                options: { sort: { 'dateModified': -1 } }
            })
            .populate({
                path: "recipes",
                select: "name description",
                options: { sort: { 'dateModified': -1 } }
            })
            .populate({
                path: "following",
                select: "username about",
                options: { sort: { 'username': 1 } }
            })
            .exec();
    }

    function createUser(user) {
        return UserModel.create(user);
    }
};