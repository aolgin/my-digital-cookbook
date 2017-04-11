module.exports = function(app, model) {
    var recipeModel = model.recipeModel;


    app.get("/api/user/:uid/recipe", findRecipesByUser);
    app.get("/api/book/:bid/recipe", findRecipesByBook);
    app.post("/api/book/:bid/recipe", createRecipe);
    app.get("/api/recipe/:rid", findRecipeById);
    app.delete("/api/recipe/:rid", deleteRecipe);
    app.put("/api/recipe/:rid", updateRecipe);
    app.get("/api/recipe/search", searchRecipes);
    app.get("/api/admin/recipes", findAllRecipes);
    app.post("/api/recipe/:rid", rateRecipe);

    var recipes = [
        {"_id": "1", "name": "My First Recipe", "description": "Lorem Ipsum", "_user": "789", "rating": 3, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/220px-Good_Food_Display_-_NCI_Visuals_Online.jpg"},
        {"_id": "2", "name": "My Second Recipe", "description": "Lorem Ipsum", "_user": "789", "rating": 5, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/220px-Good_Food_Display_-_NCI_Visuals_Online.jpg"},
        {"_id": "3", "name": "My Third Recipe", "description": "Lorem Ipsum", "_user": "789", "rating": 3, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/220px-Good_Food_Display_-_NCI_Visuals_Online.jpg"},
        {"_id": "4", "name": "My Fourth Recipe", "description": "Lorem Ipsum", "_user": "789", "rating": 4, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/220px-Good_Food_Display_-_NCI_Visuals_Online.jpg"},
        {"_id": "5", "name": "My Fifth Recipe", "description": "Lorem Ipsum", "_user": "789", "rating": 1},
        {"_id": "6", "name": "My Sixth Recipe", "description": "Lorem Ipsum", "_user": "789", "rating": 2},
        {"_id": "7", "name": "My Seventh Recipe", "description": "Lorem Ipsum", "_user": "789", "rating": 5},
        {"_id": "8", "name": "My Eighth Recipe", "description": "Lorem Ipsum", "_user": "789", "rating": 5, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/220px-Good_Food_Display_-_NCI_Visuals_Online.jpg"}
    ];

    // Service Functions

    function rateRecipe(req, res) {
        var rid = req.params['rid'];
        var rating = req.query['rating'];
        recipeModel.rateRecipe(rid, rating)
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
            })
    }


    function searchRecipes(req, res) {
        if (req.query['category']) {
            searchRecipesByCategory(req, res);
        } else {
            var term = req.query['term'];
            console.log("Searching for recipe matching: " + term);
            recipeModel.searchRecipes(term)
                .then(function(response) {
                    res.json(response);
                }, function (err) {
                    console.log(err);
                    res.sendStatus(404);
                });
        }
    }

    function searchRecipesByCategory(req, res) {
        var term = req.query['category'];
        console.log("Searching for recipe matching the category: " + term);
        recipeModel.searchRecipesByCategory(term)
            .then(function(response) {
                res.json(response);
            }, function (err) {
                console.log(err);
                res.sendStatus(404);
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

        // var userRecipes = recipes.filter(function(r) {
        //     return r._user = uid;
        // });
        //
        //
        //
        // res.json(userRecipes);

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