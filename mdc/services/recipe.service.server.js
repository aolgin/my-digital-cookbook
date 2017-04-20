module.exports = function(app, model) {
    var recipeModel = model.recipeModel;

    app.get("/api/user/:uid/recipe", findRecipesByUser);
    app.get("/api/book/:bid/recipe", findRecipesByBook);
    app.post("/api/user/:uid/recipe", createRecipe);
    app.post("/api/user/:uid/book/:bid/recipe", createRecipeInBook);
    app.get("/api/recipe/search", searchRecipes);
    app.get("/api/recipe/:rid", findRecipeById);
    app.delete("/api/recipe/:rid", deleteRecipe);
    app.put("/api/recipe/:rid", updateRecipe);
    app.get("/api/admin/recipes", findAllRecipes);

    // Service Functions

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
        if (req.query['category']) {
            searchRecipesByCategory(req, res);
        } else {
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
    }

    function searchRecipesByCategory(req, res) {
        var term = req.query['category'];
        recipeModel.searchRecipesByCategory(term)
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
                for (var i = 0; i < user.recipes.length; i++) {
                    recipes[i].description = recipes[i].description.substring(0, 5);
                }
                res.json(recipes);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function createRecipe(req, res) {
        var newRecipe = req.body;
        var uid = req.params['uid'];

        recipeModel.createRecipe(uid, newRecipe)
            .then(function (recipe) {
                res.json(recipe);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function createRecipeInBook(req, res) {
        var newRecipe = req.body;
        var uid = req.params['uid'];
        var bid = req.params['bid'];

        recipeModel.createRecipeInBook(uid, bid, newRecipe)
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