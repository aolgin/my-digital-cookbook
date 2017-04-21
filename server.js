var express = require('express');
var app = express();

var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

var secret = process.env.SESSION_SECRET || 'this is a secret';

app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

// app.use(function(req, res, next) {
//     // res.send({
//     //
//     // })
//     console.log("In the check");
//     if (req.url == "/") {
//         console.log("Redirecting");
//         return res.redirect(301, "/mdc/index.html#/home");
//     }
//     return next();
//     // res.sendfile('./public/mdc/views/home/templates/index.html');
// });

require ("./mdc/app.js")(app);

var port = process.env.PORT || 3000;

app.listen(port);