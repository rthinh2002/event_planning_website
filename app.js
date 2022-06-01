var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Create pool connection for database
var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'event_planning',
    user: 'root',
    password: 'root',
    typeCast: function castField( field, useDefaultTypeCasting ) { // This field is for casting BIT into boolean data - Peter
		if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
			var bytes = field.buffer();
			return( bytes[ 0 ] === 1 );
		}
		return( useDefaultTypeCasting() );
	}
});

var app = express();

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
