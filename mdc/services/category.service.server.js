module.exports = function(app, model) {
    var CategoryModel = model.categoryModel;

    app.get("/api/category", findCategoriesForRecipe);
    app.put("/api/category/:cid/recipe/:rid", applyCategoryToRecipe);
    app.delete("/api/category/:cid/recipe/:rid", detachCategoryFromRecipe);
    app.get("/api/category/:cid", findCategoryById);
    app.post("/api/category", createCategory);
    app.delete("/api/category/:cid", deleteCategory);
    app.get("/api/categories", listAllCategories);

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
                res.sendStatus(500);
            })
    }

    function deleteCategory(req, res) {
        var cid = req.params['cid'];
        CategoryModel.deleteCategory(cid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

};