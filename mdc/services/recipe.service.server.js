module.exports = function(app, model) {
    var recipeModel = model.recipeModel;
    var auth = authorized;

    app.get("/api/user/:uid/recipe", findRecipesByUser);
    app.get("/api/book/:bid/recipe", findRecipesByBook);
    app.post("/api/user/:uid/recipe", auth, createRecipe);
    app.delete("/api/recipe/:rid", checkSameUser, deleteRecipe);
    app.put("/api/recipe/:rid", checkSameUser, updateRecipe);
    app.put('/api/book/:bid/recipe/:rid', auth, attachRecipeToBook);
    app.delete('/api/book/:bid/recipe/:rid', auth, detachRecipeFromBook);
    app.get("/api/recipe/search", searchRecipes);
    app.get("/api/recipe/:rid", findRecipeById);
    app.post("/api/admin/recipe", checkAdmin, createRecipe);
    app.put("/api/admin/recipe/:rid", checkAdmin, updateRecipe);
    app.delete("/api/admin/recipe/:rid", checkAdmin, deleteRecipe);
    app.get("/api/admin/recipes", checkAdmin, findAllRecipes);

    // Helper functions

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    function checkSameUser(req, res, next) {
        recipeModel.findRecipeById(req.params['rid'])
            .then(function (recipe) {
                if (req.user && String(req.user._id) == String(recipe._user._id)) {
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

    function attachRecipeToBook(req, res) {
        var rid = req.params['rid'];
        var bid = req.params['bid'];

        recipeModel.attachRecipeToBook(rid, bid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function detachRecipeFromBook(req, res) {
        var rid = req.params['rid'];
        var bid = req.params['bid'];

        recipeModel.detachRecipeFromBook(rid, bid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function findAllRecipes(req, res) {
        recipeModel.findAllRecipes()
            .then(function (recipes) {
                res.json(recipes);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }


    function searchRecipes(req, res) {
        // if (req.query['category']) {
        //     searchRecipesByCategory(req, res);
        // } else {
        var term = req.query['term'];
        recipeModel.searchRecipes(term)
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

    // function searchRecipesByCategory(req, res) {
    //     var term = req.query['category'];
    //     recipeModel.searchRecipesByCategory(term)
    //         .then(function(response) {
    //             if (response.length > 0) {
    //                 res.json(response);
    //             } else {
    //                 res.sendStatus(404);
    //             }
    //         }, function (err) {
    //             console.log(err);
    //             res.sendStatus(500);
    //         });
    // }

    function findRecipesByBook(req, res) {
        var bid = req.params['bid'];

        model.bookModel.findRecipesForBook(bid)
            .then(function (response) {
                res.json(response.recipes);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findRecipesByUser(req, res) {
        var uid = req.params['uid'];
        var limit = req.query['limit'];

        model.userModel.findRecipesForUser(uid, limit)
            .then(function (user) {
                var recipes = user.recipes;
                //TODO: determine what to do with this...
                // for (var i = 0; i < user.recipes.length; i++) {
                //     recipes[i].description = recipes[i].description.substring(0, 5);
                // }
                res.json(recipes);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function createRecipe(req, res) {
        var newRecipe = req.body;
        var uid = req.params['uid'] || newRecipe._user._id;

        recipeModel.createRecipe(uid, newRecipe)
            .then(function (recipe) {
                res.json(recipe);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findRecipeById(req, res) {
        var rid = req.params['rid'];

        recipeModel
            .findRecipeById(rid)
            .then(function (recipe) {
                if (recipe) {
                    res.json(recipe);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function updateRecipe(req, res) {
        var newRecipe = req.body;
        var rid = req.params['rid'];

        recipeModel.updateRecipe(rid, newRecipe)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function deleteRecipe(req, res) {
        var rid = req.params['rid'];

        recipeModel
            .removeRecipe(rid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }
};