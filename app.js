var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var mysql = require('mysql2');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// var window = require('window');
// var gapi = require('gapi');
// window.gapi.load('client:auth2', () => {
//     window.gapi.client.init({
//         clientId: '376889211664-23uvkba9h1eb2shsj4htgr6avk4jq8qp.apps.googleusercontent.com',
//         plugin_name: "chat"
//     })});

// Create pool connection for database
var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'event_planning',
    //user: 'root',
    //password: 'root',
    typeCast: function castField( field, useDefaultTypeCasting ) { // This field is for casting BIT into boolean data - Peter
		if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
			var bytes = field.buffer();
			return( bytes[ 0 ] === 1 );
		}
		return( useDefaultTypeCasting() );
	},
    multipleStatements: true
});

// Database connection
app.use(function(req, res, next)
{
    req.pool = dbConnectionPool;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'gnirtstercesasisiht',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

/*
app.use('/app', (req, res, next) => {
    //console.log('Attempted access to app');
    if (!('user_id' in req.session)) {
        //console.log('Attempt unsuccessful');
        res.redirect('/login.html');
    } else {
    //console.log('Attempt successful');
    next();
    }
})


app.use('/admin.html', (req, res, next) => {
    console.log('Attempted access to admin');
    if (!('user_role' in req.session) || (req.session.user_role !== 'admin')) {
        //console.log(req.session);
        //console.log('Attempt to access admin unsuccessful');
        res.sendStatus(403);
    } else {
    //console.log('Attempt to access admin successful');
    next();
    }
})
*/
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
