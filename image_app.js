var express  = require('express');
var connect = require('connect');
var cookieParser = require('cookie-parser');
var logger = require("morgan");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 8080;

// Configuration
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser());

app.use(express.json());
app.use(express.urlencoded());

// Routes

require('./routes/routes.js')(app);


app.listen(port);
console.log('The App runs on port ' + port);