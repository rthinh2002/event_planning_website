const { application } = require('express');
var express = require('express');
const req = require('express/lib/request');
var router = express.Router();

var passport = require('passport');



const login = require('../public/javascripts/login.js');

let users = {
  admin: { username: "admin", name: "Some Admin", password: "admin" },
  alice: { username: "alice", name: "Alice User", password: "horse" }
};

/* GET home page. */
router.get('/home.html', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Log in to app - Karl, 2/6/22
router.post('/login', function(req, res, next) {

  req.pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "SELECT users.user_id FROM users WHERE users.user_name = ? && users.password = ?;";
    connection.query(query, [req.body.username, req.body.password], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        console.log('successful login');
        req.session.user_id = rows[0].user_id;
        console.log(req.session);
        res.sendStatus(200);
      } else {
          console.log('bad login request');
          res.sendStatus(401);
      }
    });

  });

});

// Create new account - Karl, updated 3/6/22 with DB integration
router.post('/createaccount', function(req, res, next)
{
  req.pool.getConnection(function(err, connection)
  {
    if(err)
    {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    // check if email address or username already in use
    var query1 = "SELECT users.user_id FROM users WHERE users.user_name = ? || users.email_address = ?;";
    connection.query(query1, [req.body.username, req.body.email], function (error, rows, fields) {
      if (error)
      {
        connection.release();
        console.log(error);
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        connection.release();
        console.log('account with username and/or email already exists');
        res.sendStatus(409);
        return;
      }
      else
      {
          // add new account to database
          var query2 = "INSERT INTO users (first_name, last_name, email_address, password, user_name, user_ole) VALUES (?, ?, ? ,? , ?);";
          connection.query(query2, [req.body.firstname, req.body.lastname, req.body.email, req.body.password, req.body.username, 'user'], function (error, rows, fields)
          {
            if (error)
            {
              connection.release();
              console.log(error);
              res.sendStatus(500);
              return;
            }

            //log new user in
            var query3 = "SELECT users.user_id FROM users WHERE users.user_name = ?;"
            connection.query(query3, [req.body.username], function (error, rows, fields)
            {
              connection.release();
              if (error)
              {
                console.log(error);
                res.sendStatus(500);
                return;
              }

              console.log('account created');
              req.session.user_id = rows[0].user_id;
              console.log(req.session);
              res.sendStatus(200);
            });
          });
      }
    });
  });
});

// Log in to app - Karl, 2/6/22
router.post('/logout', function(req, res, next) {
  if ('user_id' in req.session) {
    delete req.session.user_id;
    res.sendStatus(200);
  }
});

// Display user information - account.html - Peter update June 1st, 2022
router.post('/display_user_information', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT first_name, last_name, email_address, DOB, email_notification_users_response, email_notification_event, email_notification_attendee, email_notification_cancelation FROM users WHERE user_id = 1;";
    connection.query(query, function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

router.post('/change_user_info', function(req, res, next){
  //Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;

    // Decrement the date by 1 to match Adelaide time zone - Peter *cry after 6hrs of coding*
    var dob = req.body.dob;
    var correct_dob = new Date(dob);
    correct_dob.setDate(correct_dob.getDate()+1);

    var users_response = req.body.users_response;
    var notification_event = req.body.notification_event;
    var notification_attendee = req.body.notification_attendee;
    var notification_cancelation = req.body.notification_cancelation;
    var query = "UPDATE users SET first_name = ?, last_name = ?, email_address = ?, DOB = ?, email_notification_users_response = ?, email_notification_event = ?, email_notification_attendee = ?, email_notification_cancelation = ? WHERE user_id = 1;";
    connection.query(query, [first_name, last_name, email, correct_dob, users_response, notification_event, notification_cancelation, notification_attendee], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});

// Display event info editevent.html - Peter June 2nd 2022
router.post('/display_event_info', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT event.event_name, event.event_description, event.location, event.RSVP, event_date.event_date FROM event INNER JOIN event_date ON creator_id = 1 && event.event_id = 1 && event.event_id = event_date.event_id;";
    connection.query(query, function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

router.post('/display_attendee', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT users.first_name, users.email_address FROM users INNER JOIN attendee ON users.user_id = attendee.user_id && event_id = 1;";
    connection.query(query, function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

router.post('/get_hosting_event', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var session_id = req.session.id;
    var query = "SELECT * FROM event WHERE creator_id = ? GROUP BY RSVP;";
    connection.query(query, [session_id], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

router.post('/get_attending_event', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var session_id = req.session.id;
    var query = "SELECT * FROM attendee AND user_id = ? GROUP BY attendee_response;";
    connection.query(query, [session_id], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

router.get('/invited', function(req, res, next)
{
  var evid = req.query.event;
  //get the event name
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT event_description, location, RSVP FROM event WHERE event_id = ?;";
    connection.query(query, [evid], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));


module.exports = router;
