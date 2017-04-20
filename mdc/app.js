module.exports = function(app) {
    var model = require("./models/model.js")();

    require("./services/user.service.server.js")(app, model);
    require("./services/book.service.server.js")(app, model);
    require("./services/recipe.service.server.js")(app, model);
    require("./services/comment.service.server.js")(app, model);
    require("./services/category.service.server.js")(app, model);
    require("./services/notification.service.server.js")(app, model);
};