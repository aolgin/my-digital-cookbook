module.exports = function(app, model) {
    var CategoryModel = model.categoryModel;
    var auth = authorized;

    app.get("/api/category", findCategoriesForRecipe);
    app.put("/api/category/:cid/recipe/:rid", checkSameUserOrAdmin, applyCategoryToRecipe);
    app.delete("/api/category/:cid/recipe/:rid", checkSameUserOrAdmin, detachCategoryFromRecipe);
    app.get("/api/category/:cid", findCategoryById);
    app.post("/api/category", createCategory);
    app.put("/api/admin/category/:cid", checkAdmin, updateCategory);
    app.delete("/api/admin/category/:cid", checkAdmin, deleteCategory);
    app.get("/api/admin/categories", checkAdmin, listAllCategories);

    // Helper functions

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    function checkSameUserOrAdmin(req, res, next) {
        var recipe = req.body;
        if (req.user && req.user.role === 'ADMIN') {
            next();
        } else if (req.user && req.user._id == recipe._user._id) {
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

    function applyCategoryToRecipe(req, res) {
        var rid = req.params['rid'];
        var cid = req.params['cid'];
        CategoryModel.applyCategoryToRecipe(cid, rid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function detachCategoryFromRecipe(req, res) {
        var rid = req.params['rid'];
        var cid = req.params['cid'];
        CategoryModel.detachCategoryFromRecipe(cid, rid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function findCategoriesForRecipe(req, res) {
        var recipe = req.body;

        // CategoryModel.find(users)
        //     .then(function(results) {
        //         res.json(results);
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(500);
        //     })

    }

    function findCategoryById(req, res) {
        var cid = req.params['cid'];
        CategoryModel.findCategoryById(cid)
            .then(function (catObj) {
                res.json(catObj);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function listAllCategories(req, res) {
        CategoryModel.findAllCategories()
            .then(function(cats) {
                res.json(cats);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function createCategory(req, res) {
        var category = req.body;
        category.name = category.name.toUpperCase();
        CategoryModel.createCategory(category)
            .then(function(catObj) {
                res.json(catObj);
            }, function (err) {
                console.log(err);
                if (err.code === 11000) {
                    res.sendStatus(409);
                } else {
                    res.sendStatus(500);
                }
            })
    }

    function deleteCategory(req, res) {
        var cid = req.params['cid'];
        CategoryModel.removeCategory(cid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function updateCategory(req, res) {
        var cid = req.params['cid'];
        var cat = req.body;
        CategoryModel.updateCategory(cid, cat)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                if (err.code === 11000) {
                    res.sendStatus(409);
                } else {
                    res.sendStatus(500);
                }
            })
    }

};