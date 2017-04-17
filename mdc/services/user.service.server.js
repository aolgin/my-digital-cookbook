module.exports = function(app, model) {
    var userModel = model.userModel;
    var passport = require('passport');
    var bcrypt = require('bcrypt-nodejs');
    var auth = authorized;
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post  ('/api/login', passport.authenticate('local'), login);
    app.post  ('/api/logout',         logout);
    app.post  ('/api/register',       register);
    app.post  ('/api/user',     auth, createUser);
    app.get   ('/api/loggedin',       loggedin);
    app.put   ('/api/user/:uid', auth, updateUser);
    app.delete('/api/user/:uid', auth, deleteUser);
    app.get("/api/user", findUserByCredentials);
    // app.post("/api/user", createUser);
    app.get("/api/user/search", searchUsers);
    app.get("/api/user/:uid", findUserById);
    // app.delete("/api/user/:uid", deleteUser);
    // app.put("/api/user/:uid", updateUser);
    app.get("api/admin/users", findAllUsers);
    //TODO: add in favoriting and friend requests
    app.put("/api/user/:uid/follow", followUser);
    app.delete("/api/user/:uid/follow", unfollowUser);
    app.get("/api/user/:uid/follow", findFollowingByUserId);
    app.get("/api/user/:uid/follow/:chefId", isFollowingChef);

    // Helper Functions

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    // if the user exists, compare passwords with bcrypt.compareSync
                    // if(user && bcrypt.compareSync(password, user.password)) {
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                // function(user) {
                //     if (!user) { return done(null, false); }
                //     return done(null, user);
                // },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }

    // Service Functions

    function isFollowingChef(req, res) {
        var uid = req.params['uid'];
        var chefId = req.params['chefId'];

        userModel.isFollowingChef(uid, chefId)
            .then(function (response) {
                //TODO: Not sure yet in what format this will return;
                console.log(response);
                res.send(response);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function followUser(req, res) {
        var followerId = req.params['uid'];
        var userIdToFollow = req.query['followingId'];
        userModel.followUser(followerId, userIdToFollow)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }


    function unfollowUser(req, res) {
        var followerId = req.params['uid'];
        var userIdToUnfollow = req.query['followingId'];
        userModel.unfollowUser(followerId, userIdToUnfollow)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function findFollowingByUserId(req, res) {
        var uid = req.params['uid'];

        userModel.findFollowingByUserId(uid)
            .then(function (user) {
                res.json(user.friends);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                res.json(users);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function searchUsers(req, res) {
        var term = req.query['term'];
        userModel.searchUsers(term)
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

    function createUser(req, res) {
        var user = req.body;

        userModel.createUser(user)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findUserByCredentials(req, res) {
        var user = req.body;
        userModel.findUserByCredentials(user.email, user.password)
            .then(function (user) {
                if (user) {
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            }).catch(function (err) {
                res.sendStatus(500);
        });
    }

    function findUserById(req, res) {
        var uid = req.params['uid'];
        userModel
            .findUserById(uid)
            .then(function (user) {
                if (user) {
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function updateUser(req, res) {
        var uid = req.params['uid'];
        var user = req.body;

        userModel.updateUser(uid, user)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function deleteUser(req, res) {
        var uid = req.params['uid'];

        userModel
            .removeUser(uid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }
};