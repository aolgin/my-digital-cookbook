module.exports = function(app, model) {
    var userModel = model.userModel;
    var passport = require('passport');
    var bcrypt = require('bcrypt-nodejs');
    var auth = authorized;
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    var callback = process.env.GOOGLE_CALLBACK || 'callback';

    var googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callback
    };


    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    passport.use(new LocalStrategy(localStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.post  ('/api/login', passport.authenticate('local'), login);
    app.post  ('/api/logout',         logout);
    app.post  ('/api/register',       register);
    app.get   ('/api/loggedin',       loggedin);
    app.get("/api/user", findUserByCredentials);
    app.get("/api/user/search", searchUsers);
    app.get('/api/user/isAdmin', isAdmin);
    app.put('/api/user/:uid', checkSameUser, updateProfile);
    app.delete('/api/user/:uid', checkSameUser, unregisterUser);
    app.post  ('/api/admin/user', checkAdmin, createUser);
    app.put('/api/admin/user/:uid', checkAdmin, updateUser);
    app.delete('/api/admin/user/:uid', checkAdmin, unregisterUser);
    app.get("/api/user/:uid", findUserById);
    app.get("/api/admin/users", checkAdmin, findAllUsers);
    //TODO: add in favoriting and friend requests
    app.put("/api/user/:uid/follow", auth, followUser);
    app.delete("/api/user/:uid/follow", auth, unfollowUser);
    app.get("/api/user/:uid/follow", findFollowingByUserId);
    app.get("/api/user/:uid/follow/:chefId", isFollowingChef);
    app.get('/google/callback', passport.authenticate('google', {
        successRedirect: '/mdc/#/dashboard',
        failureRedirect: '/mdc/#/error?code=401'
    }));

    // Helper Functions

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    // if the user exists, compare passwords with bcrypt.compareSync
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
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

    function isAdmin(req, res) {
        res.send(req.isAuthenticated() && req.user.role === 'ADMIN' ? req.user : '0');
    }

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(function(user){
                if(user) {
                    req.login(user, function (err) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.json(user);
                        }
                    });
                }
            }).catch(function (err) {
                if (err.code == 11000) {
                    res.sendStatus(409);
                } else {
                    res.sendStatus(500);
                }
            });
    }

    function checkSameUser(req, res, next) {
        if (req.user && req.user._id == req.params['uid']) {
            next();
        } else {
            res.sendStatus(401);
        }
    }

    function checkAdmin(req, res, next) {
        if(req.user && req.user.role === 'ADMIN') {
            next();
        } else {
            res.sendStatus(401);
        }
    }

    // Service Functions

    function isFollowingChef(req, res) {
        var uid = req.params['uid'];
        var chefId = req.params['chefId'];

        userModel.isFollowingChef(uid)
            .then(function (response) {
                // Yes, this is just returning the unpopulated following.
                // The controller will do a quick check to verify if the chefId is in there
                var following = response.following;
                res.json(following);
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
                res.json(user.following);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    // For use by admin
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

    // For use by admin
    function createUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

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

    function updatePassword(req, res) {
        var uid = req.params['uid'];
        var passwords = req.body;
        userModel.findUserById(uid)
            .then(function (user) {
                if (user && bcrypt.compareSync(passwords.currentPass, user.password)) {
                    passwords.newPass = bcrypt.hashSync(passwords.newPass);
                    userModel.updatePassword(uid, passwords.newPass)
                        .then(function (response) {
                            res.sendStatus(200);
                        }, function (err) {
                            console.log(err);
                            res.sendStatus(500);
                        })
                } else if (user) {
                    res.sendStatus(404);
                } else {
                    res.sendStatus(401);
                }
            });
    }

    function updateProfile(req, res) {
        var uid = req.params['uid'];
        var user = req.body;
        if (user.currentPass) {
            updatePassword(req, res);
        } else {
            userModel.updateProfile(uid, user)
                .then(function (response) {
                    res.sendStatus(200);
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500);
                });
        }
    }

    function updateUser(req, res) {
        var uid = req.params['uid'];
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

        userModel.updateUser(uid, user)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }


    function unregisterUser(req, res) {
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