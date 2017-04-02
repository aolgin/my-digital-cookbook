module.exports = function(app, model) {
    var recipeModel = model.recipeModel;

    app.get("/api/book/:bid/recipe", findRecipesByBook);
    app.post("/api/book/:bid/recipe", createRecipe);
    app.get("/api/recipe/:rid", findRecipeById);
    app.delete("/api/recipe/:rid", deleteRecipe);
    app.put("/api/recipe/:rid", updateRecipe);
    app.get("/api/recipe/search", searchRecipes);

    // Service Functions

    function searchRecipes(req, res) {
        if (req.query['category']) {
            searchRecipesByCategory(req, res);
        } else {
            var term = req.query['term'];
            console.log("Searching for recipe matching: " + term);
            // recipeModel.searchRecipes(term)
            //     .then(function(response) {
            //         res.json(response);
            //     }, function (err) {
            //         console.log(err);
            //         res.sendStatus(404);
            //     });
        }
    }

    function searchRecipesByCategory(req, res) {
        var term = req.query['category'];
        console.log("Searching for recipe matching the category: " + term);
        // recipeModel.searchRecipesByCategory(term)
        //     .then(function(response) {
        //         res.json(response);
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(404);
        //     });
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

    function createRecipe(req, res) {
        var newRecipe = req.body;
        var bid = req.params['bid'];

        recipeModel.createRecipe(bid, newRecipe)
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