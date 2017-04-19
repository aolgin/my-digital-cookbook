module.exports = function(app, model) {
    var CommentModel = model.commentModel;

    app.get("/api/comment/:cid", findCommentById);
    app.get("/api/recipe/:rid/comment", findCommentsForRecipe);
    app.post("/api/recipe/:rid/comment", createComment);
    app.delete("/api/comment/:cid", deleteComment);
    app.put("/api/comment/:cid", updateComment);

    // Service Functions

    // TODO potentially unnecessary
    function findCommentsForRecipe(req, res) {
        var rid = req.params['rid'];

        CommentModel.findCommentsForRecipe(rid)
            .then(function(results) {
                res.json(results);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })

    }

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