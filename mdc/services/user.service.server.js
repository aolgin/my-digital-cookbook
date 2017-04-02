module.exports = function(app, model) {
    // var userModel = model.userModel;

    app.get("/api/user", findUserByCredentials);
    app.post("/api/user", createUser);
    app.get("/api/user/:uid", findUserById);
    app.delete("/api/user/:uid", deleteUser);
    app.put("/api/user/:uid", updateUser);
    app.get("/api/user/search", searchUsers);

    var users = [
        {_id: "123", email: "alice@wonderland.com", password: "alice", firstName: "Alice", lastName: "Wonder", displayName: 'Alyss'},
        {_id: "234", email: "bob@builder.org", password: "bob", firstName: "Bob", lastName: "Marley", displayName: 'Bob the Builder'},
        {_id: "345", email: "charly@candymountain.net", password: "charly", firstName: "Charly", lastName: "Garcia", displayName: 'C-dog'}
    ];

    // Helper Functions

    function findIndexById(uid) {
        var index = users.findIndex(function(u) {
            return u._id === uid;
        });
        return index;
    }

    // Service Functions

    function searchUsers(req, res) {
        var term = req.query['term'];
        console.log("Searching for user matching: " + term);
        // userModel.searchUsers(term)
        //     .then(function(response) {
        //         res.json(response);
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(404);
        //     });
    }

    function createUser(req, res) {

        var user = req.body;
        var userId = String(new Date().getTime());
        user._id = userId;
        // var newUser = {
        //     "_id": userId,
        //     "password": user.password,
        //     "email": user.email
        // };
        users.push(user);
        res.json(user);

        // userModel.createUser(uid, newUser)
        //     .then(function (user) {
        //         res.json(user);
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(500);
        //     });
    }

    function findUserByCredentials(req, res) {
        var email = req.query['email'];
        var password = req.query['password'];

        var user = users.find(function (u) {
            return u.email === email &&
                u.password === password;
        });
        if(user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    }

    function findUserById(req, res) {
        var uid = req.params['uid'];

        var user = users.find(function (u) {
            return u._id === uid;
        });
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(503);
        }
        // userModel
        //     .findUserById(uid)
        //     .then(function (user) {
        //         if (user) {
        //             res.json(user);
        //         } else {
        //             res.sendStatus(404);
        //         }
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(500);
        //     });
    }

    function updateUser(req, res) {
        var uid = req.params['uid'];

        var index = findIndexById(uid);
        var user = req.body;

        users[index].firstName = user.firstName;
        users[index].lastName = user.lastName;
        users[index].email = user.email;
        users[index].displayName = user.displayName;
        users[index].about = user.about;
        res.sendStatus(200);

        // userModel.updateUser(uid, newUser)
        //     .then(function (response) {
        //         res.sendStatus(200);
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(500);
        //     });
    }

    function deleteUser(req, res) {
        var uid = req.params['uid'];

        var index = findIndexById(req.params['uid']);
        users.splice(index, 1);
        res.sendStatus(200);

        // userModel
        //     .removeUser(uid)
        //     .then(function (response) {
        //         res.sendStatus(200);
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(500);
        //     })
    }
};