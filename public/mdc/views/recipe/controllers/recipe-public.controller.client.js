(function () {
    angular
        .module("MyDigitalCookbook")
        .controller("PublicRecipeController", PublicRecipeController);

    function PublicRecipeController(RecipeService, $routeParams, $sce, currentUser, UserService, adminUser, $location) {
        var vm = this;
        vm.rid = $routeParams['rid'];
        if (currentUser) {
            vm.uid = currentUser._id;
            vm.books = currentUser.books;
            vm.username = currentUser.username;
        }
        if (adminUser) {
            vm.admin = true;
        }

        function init() {
            RecipeService.findRecipeById(vm.rid)
                .then(function (response) {
                    vm.recipe = response.data;
                    if (vm.recipe.comments.length === 0) {
                        vm.commentsMsg = "No comments yet! Please login to comment and rate this recipe.";
                    }
                    isYourRecipe();
                }).catch(function (err) {
                    vm.error = "An error occurred finding this recipe. We apologize for any inconvenience:\n" + err;
                    vm.yourRecipe = false;
                });
        }
        init();

        vm.getTrustedHtml = getTrustedHtml;
        vm.search = search;
        vm.logout = logout;
        vm.commentOnRecipe = commentOnRecipe;
        vm.commentBoxToggle = commentBoxToggle;
        vm.deleteComment = deleteComment;
        vm.attachRecipeToBook = attachRecipeToBook;

        function attachRecipeToBook(book) {
            RecipeService.attachRecipeToBook(vm.rid, book._id)
                .then(function (response) {
                    vm.error = null;
                    vm.message = "Successfully added recipe to " + book.name + "!";
                }).catch(function (err) {
                    vm.message = null;
                    vm.error = "An unexpected error occured while trying to add this recipe to your book:\n" + err;
                });
        }

        function deleteComment(cid) {
            var answer = confirm("Are you sure you would like to delete this comment?");
            if (answer) {
                RecipeService.deleteComment(cid, vm.rid)
                    .then(function (response) {
                        vm.commentMsg = "Comment successfully deleted";
                        // Refresh the data once comments are added, otherwise, the comment won't show up until page refresh
                        RecipeService.findRecipeById(vm.rid)
                            .then(function (response) {
                                vm.recipe = response.data;
                                if (vm.recipe.comments.length === 0) {
                                    vm.commentsMsg = "No comments yet! Please login to comment and rate this recipe.";
                                }
                            });
                    }).catch(function (err) {
                        vm.commentErr = "An unexpected error occured trying to delete your comment:\n" + err;
                    });
            }
        }

        function commentBoxToggle() {
            if (!vm.showCommentBox) {
                vm.showCommentBox = true;
            } else {
                vm.showCommentBox = false;
            }
        }

        function commentOnRecipe(comment) {
            if (!comment.text) {
                vm.commentErr = "Please type in a comment before submission!";
            } else if (comment.rating && (comment.rating > 5 || comment.rating < 1)) {
                vm.commentErr = "Please rate this recipe between 1 and 5";
            } else {
                vm.commentErr = null;
                var promise = RecipeService.commentOnRecipe(comment, vm.rid, vm.uid);
                promise.then(function (response) {
                    vm.commentMsg = "Comment successfully posted! Thank you!";
                    vm.showCommentBox = false;
                    vm.commentsMsg = null;
                    // Need to refresh the data once comments are added, otherwise, the comment won't show up until page refresh
                    RecipeService.findRecipeById(vm.rid)
                        .then(function (response) {
                            vm.recipe = response.data;
                        });
                }).catch(function (err) {
                    console.log(err);
                    vm.commentErr = "An unexpected error occurred when trying to post your comment:\n" + err;
                })
            }
        }

        function isYourRecipe() {
            if (currentUser && currentUser._id === vm.recipe._user._id) {
                vm.yourRecipe = true;
            } else {
                vm.yourRecipe = false;
            }
        }

        function search(term, type) {
            $location.url("/search/results?term=" + term + "&type=" + type);
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $location.url("/");
                });
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

    }
})();