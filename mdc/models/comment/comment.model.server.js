module.exports = function() {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var CommentSchema = require("./comment.schema.server")();
    var CommentModel = mongoose.model("CommentModel", CommentSchema);

    var api = {
        createComment: createComment,
        findCommentById: findCommentById,
        findCommentsForRecipe: findCommentsForRecipe,
        updateComment: updateComment,
        removeComment: removeComment,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function createComment(comment, rid, uid) {
        // TODO Need to somehow insert rating here
        return CommentModel
            .create(comment)
            .then(function (commentObj) {
                model.recipeModel.findRecipeById(rid)
                    .then(function(recipeObj) {
                        model.userModel.findUserById(uid)
                            .then(function (userObj) {
                                recipeObj.comments.push(commentObj);
                                if (comment.rating) {
                                    recipeObj.rating.count += 1;
                                    recipeObj.rating.total += comment.rating;
                                    recipeObj.rating.actual = recipeObj.rating.total / recipeObj.rating.count;
                                }
                                recipeObj.save();
                                commentObj._recipe = recipeObj;
                                commentObj._user = userObj;
                                commentObj.save();
                                return recipeObj;
                            });
                    })
            })
    }

    function findCommentById(cid) {
        return CommentModel.findById(cid);

    }

    function findCommentsForRecipe(rid) {
        return model.recipeModel.findCommentsForRecipe(rid);
    }

    function updateComment(cid, text, rating) {
        return CommentModel.findById(cid)
            .then(function (commentObj) {
                if (commentObj.rating && commentObj.rating !== rating) {
                    model.recipeModel.findById(commentObj._recipe._id)
                        .then(function (recipeObj) {
                            recipeObj.rating.total -= commentObj.rating;
                            recipeObj.rating.total += rating;
                            recipeObj.rating.actual = recipeObj.rating.total / recipeObj.rating.count;
                        })
                }
            })
            .then(function (response) {
                return CommentModel.update(
                    {
                        _id: cid
                    },
                    {
                        text: text,
                        rating: rating
                    });
            });
    }

    function removeComment(cid, rid) {
        return model.recipeModel
            .findRecipeById(rid)
            .then(function (recipeObj) {
                CommentModel
                    .findById(cid)
                    .then(function(commentObj) {
                        if (commentObj.rating) {
                            recipeObj.rating.count -= 1;
                            recipeObj.rating.total -= commentObj.rating;
                            recipeObj.rating.actual = recipeObj.rating.total / recipeObj.rating.count;
                        }
                        recipeObj.comments.pull(commentObj);
                        recipeObj.save();
                        CommentModel.remove({_id: cid})
                            .then(function (response) {
                                return recipeObj;
                            });
                    })
            });
    }
};