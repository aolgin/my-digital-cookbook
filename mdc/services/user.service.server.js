module.exports = function(app, model) {
    var userModel = model.userModel;

    app.post("/api/user/:uid/user", createUser);
    app.get("/api/user/:uid", findUserById);
    app.delete("/api/user/:uid", deleteUser);
    app.put("/api/user/:uid", updateUser);

    // Service Functions

    function createUser(req, res) {
        var newUser = req.body;
        var uid = req.params['uid'];

        userModel.createUser(uid, newUser)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findUserById(req, res) {
        var uid = req.params['uid'];

        userModel
            .findUserById(uid)
            .then(function (user) {
                if (user) {
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function updateUser(req, res) {
        var newUser = req.body;
        var uid = req.params['uid'];

        userModel.updateUser(uid, newUser)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function deleteUser(req, res) {
        var uid = req.params['uid'];

        userModel
            .removeUser(uid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }
};