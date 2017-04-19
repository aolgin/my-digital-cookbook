module.exports = function() {

    var mongoose = require('mongoose');
    var mongojs  = require('mongojs');

    mongoose.Promise = require('q').Promise;

    var connectionString = 'mongodb://localhost/mdc';
    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }
    mongoose.connect(connectionString);
    mongojs('mdc');

    var userModel = require("./user/user.model.server")();
    var bookModel = require("./book/book.model.server")();
    var recipeModel = require("./recipe/recipe.model.server")();
    var fileModel = require("./file/file.model.server")();
    var categoryModel = require("./category/category.model.server")();
    var commentModel = require("./comment/comment.model.server")();
    var notificationModel = require("./notification/notification.model.server")();
    
    var model = {
        userModel: userModel,
        bookModel: bookModel,
        recipeModel: recipeModel,
        fileModel: fileModel,
        notificationModel: notificationModel,
        categoryModel: categoryModel,
        commentModel: commentModel,
        mongojs: mongojs
    };

    model.userModel.setModel(model);
    model.bookModel.setModel(model);
    model.recipeModel.setModel(model);
    model.fileModel.setModel(model);
    model.notificationModel.setModel(model);
    model.categoryModel.setModel(model);
    model.commentModel.setModel(model);

    return model;
};