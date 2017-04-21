module.exports = function(app, model) {
    var CommentModel = model.commentModel;

    var auth = authorized;

    app.get("/api/comment/:cid", findCommentById);
    // app.get("/api/recipe/:rid/comment", findCommentsForRecipe);
    app.post("/api/recipe/:rid/comment", auth, createComment);
    app.delete("/api/comment/:cid", auth, deleteComment);
    app.put("/api/comment/:cid", auth, updateComment);
    // TODO: Need to determine best way to actually use checkSameUserOrAdmin. Just an auth check will do for the meantime, though
    // app.delete("/api/comment/:cid", checkSameUserOrAdmin, deleteComment);
    // app.put("/api/comment/:cid", checkSameUserOrAdmin, updateComment);

    // Helper Functions
    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    function checkSameUserOrAdmin(req, res, next) {
        var comment = req.body;
        if (req.user && req.user.role === 'ADMIN') {
            next();
        } else if (req.user && req.user._id == comment._user._id) {
            next();
        } else {
            res.sendStatus(401);
        }
    }

    // Service Functions

    // // Was not really in use
    // function findCommentsForRecipe(req, res) {
    //     var rid = req.params['rid'];
    //
    //     CommentModel.findCommentsForRecipe(rid)
    //         .then(function(results) {
    //             res.json(results);
    //         }, function (err) {
    //             console.log(err);
    //             res.sendStatus(500);
    //         });
    // }

    function findCommentById(req, res) {
        var cid = req.params['cid'];
        CommentModel.findCommentById(cid)
            .then(function (notifyObj) {
                res.json(notifyObj);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function listAllComments(req, res) {
        CommentModel.findAllComments()
            .then(function(comments) {
                res.json(comments);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function findCommentsByUser(req, res) {
        var uid = req.params['uid'];
        CommentModel.findCommentsByUser(uid)
            .then(function (results) {
                res.json(results);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function createComment(req, res) {
        var rid = req.params['rid'];
        var uid = req.query['uid'];
        var comment = req.body;
        CommentModel.createComment(comment, rid, uid)
            .then(function(comment) {
                res.json(comment);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function updateComment(req, res) {
        var cid = req.params['cid'];
        CommentModel.updateComment(cid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

    function deleteComment(req, res) {
        var cid = req.params['cid'];
        var rid = req.query['rid'];
        CommentModel.removeComment(cid, rid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

};