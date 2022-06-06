const { application } = require('express');
var express = require('express');
var session = require('express-session');
const req = require('express/lib/request');
var router = express.Router();

var passport = require('passport');

const argon2 = require('argon2');
const login = require('../public/javascripts/login.js');

/* GET home page. */
router.get('/home.html', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Log in to app - Karl, updated security to inlude argon2 4/6/22
router.post('/login', function(req, res, next) {

  req.pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "SELECT user_id, user_role, password FROM users WHERE user_name = ?;";
    connection.query(query, [req.body.username], async function(error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {

        try {
          if (await argon2.verify(rows[0].password, req.body.password)) {
            // password match
            //console.log('successful login');
            delete rows[0].password; // remove password from retrived data
            req.session.user_id = rows[0].user_id;
            req.session.user_role = rows[0].user_role;
            console.log(req.session);
            res.sendStatus(200);
          } else {
            // password did not match
            //console.log('bad password');
            res.sendStatus(401);
          }
        } catch (err) {
          // internal failure
          //console.log('bad verify');
          res.sendStatus(401);
        }

      } else {
        //console.log('bad user');
        res.sendStatus(401);
      }
    });

  });

});

// Create new account - Karl, updated 3/6/22 with DB integration
router.post('/createaccount', function(req, res, next)
{
  req.pool.getConnection(async function(err, connection)
  {
    if(err) {
      //console.log(err);
      res.sendStatus(500);
      return;
    }

    let hash = null;

    try {
      hash = await argon2.hash(req.body.password);
    } catch (err) {
      //console.log(err);
      res.sendStatus(500);
      return;
    }

    // add new account to database
    var query = "INSERT INTO users (first_name, last_name, email_address, user_name, password, user_role) VALUES (?, ?, ?, ?, ?, ?);";
    connection.query(query, [req.body.firstname, req.body.lastname, req.body.email, req.body.username, hash, 'user'], function (error, rows, fields)
    {
      if (error) {
        connection.release();
        console.log(error);
        if (error.code === "ER_DUP_ENTRY") {
          console.log('account with username and/or email already exists');
          return res.sendStatus(409);
        } else {
          return res.sendStatus(500);
        }
      }

      //log new user in
      query = "SELECT user_id FROM users WHERE user_id = LAST_INSERT_ID();"
      connection.query(query, function (error, rows, fields)
      {
        connection.release();
        if (error) {
          //console.log(error);
          res.sendStatus(500);
          return;
        }

        //console.log('account created');
        req.session.user_id = rows[0].user_id;
        //console.log(req.session);
        res.sendStatus(200);
      });
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
    var query = "SELECT first_name, last_name, email_address, DOB, email_notification_users_response, email_notification_event, email_notification_attendee, email_notification_cancelation FROM users WHERE user_id = ?;";
    connection.query(query, [req.session.user_id], function (err, rows, fields) {
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
    var query = "UPDATE users SET first_name = ?, last_name = ?, email_address = ?, DOB = ?, email_notification_users_response = ?, email_notification_event = ?, email_notification_attendee = ?, email_notification_cancelation = ? WHERE user_id = ?;";
    connection.query(query, [first_name, last_name, email, correct_dob, users_response, notification_event, notification_cancelation, notification_attendee, req.session.user_id], function (err, rows, fields) {
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

router.post('/display_event_info_eventvieworg', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT event.event_name, event.event_description, event.location, event.RSVP FROM event WHERE event.event_id = 1;";
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

// Display attendee for editevent.html - Peter 4/6/2022
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

    var user_id = req.session.user_id;
    //var query = "SELECT * FROM event WHERE creator_id = ? GROUP BY RSVP;";
    var query = "SELECT * FROM event WHERE creator_id = ? ORDER BY RSVP DESC;";
    connection.query(query, [user_id], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

// Route for display attendee - Peter 1/6/2022
router.post('/get_attending_event', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var user_id = req.session.user_id;
    var query = "SELECT * FROM attendee AND user_id = ? GROUP BY attendee_response;";
    connection.query(query, [user_id], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

// Route to save only event info, not add date and attendee - Peter 3/6/2022
router.post('/save_event_info', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE event SET event_name = ?, event_description = ?, location = ?, RSVP = ? WHERE event_id = 1 ";
    connection.query(query, [req.body.event_name, req.body.event_description, req.body.location, req.body.rsvp] ,function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

// Route to save only date - Peter 4/6/2022
router.post('/save_event_date', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log(req.body.event_date);
    var query = "INSERT INTO event_date(event_date, event_id) VALUES ( ?, 1 );";
    connection.query(query, [req.body.event_date] ,function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

// Route that will only add attendee to the table - Peter 4/6/2022
router.post('/save_event_attendee', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO attendee(event_id, user_id) VALUES(1, (SELECT user_id FROM users WHERE first_name = ? AND email_address = ?));";
    connection.query(query, [req.body.first_name, req.body.email_address] ,function (err, rows, fields) {
      connection.release(); // release connection
      if(err) {
        console.log(err);
        res.send("Error");
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

//router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

//router.get('/google/callback',' google', passport.authenticate('google', { successRedirect:'/auth/success' , failureRedirect: '/auth/fail' }));

// router.get('/auth/success', function(req, res, next){
//   req.session.user_id ? function() { //if user is logged in
//     //update the google id into the users table's api token column
//     req.pool.getConnection(function(err, connection){
//       if(err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       var query = "UPDATE users SET api_token = ? WHERE user_id = ?;";
//       connection.query(query, [req.user.id, req.session.user_id], function (err, rows, fields) {
//         connection.release(); // release connection
//         if (err) {
//           res.sendStatus(500);
//           return;
//         }
//         res.redirect('/');
//       });
//     });
//   }
//   :
//   function() { //if user is not logged in
//     req.pool.getConnection(function(err, connection) {
//     if(err) {
//       console.log(err);
//       res.sendStatus(500);
//       return;
//     }
//     var query = "SELECT users.user_id FROM users WHERE users.api_token = ?";
//     connection.query(query, [req.user.id], function (error, rows, fields) {
//       connection.release();
//       if (error) {
//         console.log(error);
//         res.sendStatus(500);
//         return;
//       }
//       if (rows.length > 0) {
//         console.log('successful login');
//         req.session.user_id = rows[0].user_id;
//         console.log(req.session);
//         res.sendStatus(200);
//       } else {
//           console.log('bad login request');
//           res.sendStatus(401);
//       }
//     });
//   });
//   };
// });

// router.get('/auth/fail', function(req, res, next){
//   alert('Failed to authenticate');
//   window.location.href = "/public/login.html";
// });


router.post('/create_new_event', function(req, res, next)
{

  req.pool.getConnection(async function(err, connection)
  {
    if(err) {
      //console.log(err);
      res.sendStatus(500);
      return;
    }

     // add new account to database
    var query = "INSERT INTO event (event_name, event_description, creator_id, location, RSVP) VALUES (?, ?, ?, ?, ?);";
    connection.query(query, [req.body.eventName, req.body.details, req.session.user_id, req.body.eventLocation, req.body.rsvp], function (error, rows, fields)
    {
      if (error) {
        connection.release();
        console.log(error);
        return res.sendStatus(500);
      }

      return res.sendStatus(200);

    });

  });

});

module.exports = router;
