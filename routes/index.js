const { application } = require('express');
var express = require('express');
var session = require('express-session');
const req = require('express/lib/request');
var router = express.Router();
var gapi = require('googleapis');
const CLIENT_ID = '376889211664-23uvkba9h1eb2shsj4htgr6avk4jq8qp.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const argon2 = require('argon2');
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'sarai.stamm71@ethereal.email',
      pass: 'GXktnUSngkcad1hkDf'
  }
});


router.post('/email', function(req, res, next) {

  console.log(req.body);

  req.pool.getConnection(async function(err, connection) {
    connection.release();
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var password = Math.random().toString(36).slice(-32);
    let hash = null;

    try {
      hash = await argon2.hash(password);
    } catch (err) {
      //console.log(err);
      res.sendStatus(500);
      return;
    }

    // get details of user
    var event_host;
    connection.query("SELECT first_name, last_name, email_address FROM users WHERE user_id = ?;", [req.session.user_id], function (error, rows, fields) {
      connection.release();
      if (error) {
        //console.log(error);
        return res.sendStatus(500);
      }
      if (rows.length === 0) {
        return res.sendStatus(500);
      } else {
        event_host = rows[0];
      }
    });

    //send email to guests
    connection.query("SELECT user_role FROM users WHERE email_address = ?;", [req.body.guest_email], function (error, rows, fields) {
      connection.release();
      if (error) {
        //console.log(error);
        return res.sendStatus(500);
      }

      if (rows.length === 0) {
        console.log('no data');
        return res.sendStatus(500);
      } else if (rows[0].user_role === 'guest') {

        // add new account to database
        var query = "INSERT INTO users (password) VALUES (?);";
        connection.query(query, [hash], function (error, rows, fields) {
          connection.release();
          if (error) {
              return res.sendStatus(500);
            }
        });

        var emailText = ("Hi " + req.body.guest_name + "!" + event_host.first_name + "is inviting you to meet up!\n" + "Respond to " + req.body.guest_name + " at: when2meet/login.html\n" + "Your password to log in is: " + password);
        let info = transporter.sendMail({
          from: event_host.email_address,
          to: req.body.guest_email,
          subject: "when2meet invitation",
          text: emailText,
          html: "<body><p>Hi" + req.body.guest_name + "!</p>" +
                "<p>" + event_host.first_name + "is inviting you to meet up!</p>" +
                "<p>Respond to " + req.body.guest_name + " at: <a href=\"when2meet.com/login.html\">when2meet</a></p>" +
                "<p>Your password to log in is: " + password + "</p></body>",
        });
      } else {

        var emailText = "Hi" + req.body.guest_name + "!" + event_host.first_name + "is inviting you to meet up!\n" + "Log in to your account to respond to " + req.body.guest_name + " at: when2meet/login.html\n";

        let info = transporter.sendMail({
          from: event_host.email_address,
          to: req.body.guest_email,
          subject: "when2meet invitation",
          text: emailText,
          html: "<body><p>Hi " + req.body.guest_name + "!</p>" +
                "<p>" + event_host.first_name + "is inviting you to meet up!</p>" +
                "<p>Log in to your account to respond to " + req.body.guest_name + " at: <a href=\"when2meet.com/login.html\">when2meet</a></p></body>",
        });
      }

      res.send();
    });
  });
});

/* GET home page. */
router.get('/home.html', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Log in to app - Karl, updated security to include argon2 4/6/22
router.post('/login', function(req, res, next) {

  if (!(req.body.password) || req.body.password === '' || req.body.password === null) {
    return res.sendStatus(500);
  }

  req.pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "SELECT user_id, user_role, password FROM users WHERE user_name = ? AND user_role != 'guest';";
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
            delete rows[0].password; // remove password from retrieved data
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

// Log in to app - Karl, updated security to include argon2 4/6/22
router.post('/get_user_details', function(req, res, next) {

  req.pool.getConnection(function(err, connection) {
    connection.release();
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    connection.query("SELECT first_name, user_role FROM users WHERE user_id = ?;", [req.session.user_id], function (error, rows, fields) {
      connection.release();
      if (error) {
        //console.log(error);
        return res.sendStatus(500);
      }
      res.json(rows);
    });
  });
});

// Create new account - Karl, updated 3/6/22 with DB integration
router.post('/createaccount', function(req, res, next)
{
  // request must have a password, and cannot be empty
  if (!(req.body.password) || req.body.password === '' || req.body.password === null) {
    return res.sendStatus(500);
  }

  req.pool.getConnection(async function(err, connection) {
    if(err) {
      //console.log(err);
      return res.sendStatus(500);
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
    connection.query(query, [req.body.firstname, req.body.lastname, req.body.email, req.body.username, hash, 'user'], function (error, rows, fields) {

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
    });

    //log new user in
    query = "SELECT user_id FROM users WHERE user_id = LAST_INSERT_ID();"
    connection.query(query, function (error, rows, fields) {
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
    var query = "SELECT event_date.date_status, event_date.event_date_id, event.event_name, event.event_description, event.location, event.RSVP, event_date.event_date FROM event INNER JOIN event_date ON creator_id = ? && event.event_id = ? && event.event_id = event_date.event_id;";
    connection.query(query, [req.session.user_id, req.body.event_id], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

// Display event info editevent.html - Peter June 2nd 2022
router.post('/display_event_info_invite', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT event_date.date_status, event_date.event_date_id, event.event_name, event.event_description, event.location, event.RSVP, event_date.event_date FROM event INNER JOIN event_date ON event.event_id = event_date.event_id WHERE event.event_id = ?;";
    connection.query(query, [req.body.event_id], function (err, rows, fields) {
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
    var query = "SELECT DISTINCT users.first_name, users.email_address, users.user_id FROM users INNER JOIN attendee ON attendee.user_id = users.user_id INNER JOIN event_date on attendee.event_date_id = event_date.event_date_id WHERE event_date.event_id = ?;";
    connection.query(query, [req.body.event_id], function (err, rows, fields) {
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

router.post('/get_attending_event', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var user_id = req.session.user_id;
    var query = "SELECT DISTINCT event.event_id, event.event_status, event.event_name, users.first_name, users.last_name \
                 FROM users INNER JOIN event ON users.user_id = event.creator_id \
                 INNER JOIN event_date ON event.event_id = event_date.event_id \
                 INNER JOIN attendee ON event_date.event_date_id = attendee.event_date_id \
                 WHERE attendee.user_id = ?;";
    connection.query(query, [user_id], function (err, rows, fields) {
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

// Delete event eventvieworg.html delete_date
router.post('/delete_date', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "DELETE FROM event_date WHERE event_date_id = ?";
    connection.query(query, [req.body.event_date_id] ,function (err, rows, fields) {
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

// Route to confirm date status
router.post('/update_date_status', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE event_date SET date_status = 1 WHERE event_date_id = ?;";
    connection.query(query, [req.body.date_id] ,function (err, rows, fields) {
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

// Route to save only event info, not add date and attendee - Peter 3/6/2022
router.post('/save_event_info', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE event SET event_name = ?, event_description = ?, location = ?, RSVP = ? WHERE event_id = ? ";
    connection.query(query, [req.body.event_name, req.body.event_description, req.body.location, req.body.rsvp, req.body.event_id] ,function (err, rows, fields) {
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
    var query = "INSERT INTO event_date(event_date, event_id) VALUES ( ?, ? ); SELECT event_date_id FROM event_date WHERE event_date = ? AND event_id = ?;";
    connection.query(query, [req.body.event_date, req.body.event_id, req.body.event_date, req.body.event_id] ,function (err, rows, fields) {
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

// Route that will only populate exist attendee with new date id - Peter 7/6/2022
router.post('/save_event_attendee_date', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO attendee(user_id, event_date_id) VALUES(?, ?);";
    connection.query(query, [req.body.user_id, req.body.event_date_id] ,function (err, fields) {
      connection.release(); // release connection
      if(err) {
        console.log(err);
        res.send("Error");
        return;
      }
    });
    res.send("Success!");
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
    for(var i in req.body.event_date_id) {
      var query = "INSERT INTO attendee(user_id, event_date_id) VALUES((SELECT user_id FROM users WHERE first_name = ? AND email_address = ?), ?);";
      connection.query(query, [req.body.first_name, req.body.email_address, req.body.event_date_id[i]] ,function (err, fields) {
        connection.release(); // release connection
        if(err) {
          console.log(err);
          res.send("Error");
          return;
        }
      });
    }
    res.send("Success!");
  });
});

// Route that return list of attendee to the event
router.post('/get_attendee', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log(req.body.event_date);
    var query = "SELECT attendee.attendee_response, users.first_name FROM attendee INNER JOIN users ON users.user_id = attendee.user_id WHERE event_date_id = ?;";
    connection.query(query, [req.body.event_date_id] ,function (err, rows, fields) {
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

router.post('/update_invite', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log(req.body.event_date);
    var query = "UPDATE attendee INNER JOIN event_date ON attendee.event_date_id = event_date.event_date_id SET attendee.attendee_response = ? WHERE attendee.user_id = ? AND attendee.event_date_id = ?;";
    connection.query(query, [req.body.response_string, req.session.user_id, req.body.event_date_id] ,function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
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


router.post('/check_guests', function(req, res, next) {

    req.pool.getConnection(function(error, connection) {
      if (error) {
        console.log(error); console.log("line 451");
        return res.sendStatus(500);
      }

      // check if user email exists - must be unique, so if not then user has no account
      connection.query("SELECT * FROM users WHERE email_address = ?;", [req.body.email], function (error, userRows, fields) {
        connection.release();
        if (error) {
          console.log(error); console.log("line 459");
          return res.sendStatus(500);
        }

        if (userRows.length === 0) { console.log("no user");
          req.pool.getConnection(function(error, connection) {
            if (error) {
              console.log(error); console.log("line 466");
              return res.sendStatus(500);
            }
            var queryNewUser = "INSERT INTO users (first_name, last_name, email_address, user_name, user_role) VALUES (?, ?, ?, ?, ?);";
            connection.query(queryNewUser, [req.body.name, 'GUEST', req.body.email, req.body.email, 'guest'], function (error, rows, fields) {
              connection.release();
              if (error) {
                console.log(error); console.log("line 473");
                return res.sendStatus(500);
              }
            });
          });
        } // end if-statement
      });
    });

  return res.sendStatus(200);
});
// add a new event to the database - KG last edited 7/6/22
router.post('/create_new_event', function(req, res, next) {
  // check a user is logged in

  if (!req.session.user_id) {
      console.log("No user logged in to session");
      res.sendStatus(500);
      return;
  }

  // get connection
  req.pool.getConnection(function(error, connection) {
    if (error) {
      console.log(error); console.log("line 487");
      return res.sendStatus(500);
    }
    // add new event to database
    var query = "INSERT INTO event (event_name, event_description, creator_id, location, RSVP) VALUES (?, ?, ?, ?, ?);";
    connection.query(query, [req.body.eventName, req.body.details, req.body.user_id, req.body.eventLocation, req.body.rsvp], function (error, rows, fields) {
      if (error) {
        connection.release(); console.log(error); console.log("line 494");
        return res.sendStatus(500);
      }
    });

    connection.query("SELECT LAST_INSERT_ID() AS id;", function (error, rows2, fields) {
      connection.release();
      if (error) {
        console.log(error); console.log("line 494");
        return res.sendStatus(500);
      }
      res.json(rows2[0].id); //send response
    });
  });
});

router.post('/add_event_date', function(req, res, next) {

  console.log(req.body);
  req.pool.getConnection(function(error, connection) {
    if (error) {
      console.log(error); console.log("line 487");
      return res.sendStatus(500);
    }

    var query = "INSERT INTO attendee (user_id, event_date_id) \
                 VALUES ((SELECT user_id FROM users WHERE email_address = ?), \
                         (SELECT event_date_id FROM event_date WHERE event_date = ? AND event_id = ?));"
    connection.query(query, [req.body.email, req.body.date, req.body.event_id], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log("Unsuccessful date add"); console.log(error);
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });
});

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });

  // Do our logout on server here

}

// function getApiKey() {
//   var auth2 = gapi.auth2.getAuthInstance();
//   var apiKey = auth2.currentUser.get().getAuthResponse().id_token;
//   console.log(apiKey);
//   return apiKey;
// }

router.post('/tokensignin', async function(req, res, next) {
  try {
    const ticket = await client.verifyIdToken({
        idToken: req.body.idtoken,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    //check if the userid is in the database
    req.pool.getConnection(function(err, connection){
      if(err) {
        console.log(err);
        // res.sendStatus(500);
        return;
      }
      var query = "SELECT users.user_id FROM users WHERE users.api_token = ?";
      connection.query(query, [userid], function (error, rows, fields) {
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
            //create new user in database with the data from google and api key
            req.pool.getConnection(function(err, connection){
              if(err) {
                console.log(err);
                return;
              }
              //generate a random password
              var password = Math.random().toString(36).slice(-32);
              var query = "INSERT INTO users (user_name, email_address, first_name, last_name, api_token, password, user_role) VALUES (?, ?, ?, ?, ?, ?, ?);";
              connection.query(query, [payload.email, payload.email, payload.given_name, payload.family_name, userid, password, 'user'], function (error, rows, fields) {
                connection.release();
                if (error) {
                  console.log(error);
                  res.sendStatus(500);
                  return;
                }
                console.log('successful login with create new user');
                //get the user id of the new user
                req.pool.getConnection(function(err, connection){
                  if(err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                  }
                  var query = "SELECT users.user_id FROM users WHERE users.api_token = ?";
                  connection.query(query, [userid], function (error, rows, fields) {
                    connection.release();
                    if (error) {
                      console.log(error);
                      res.sendStatus(500);
                      return;
                    }
                    req.session.user_id = rows[0].user_id;
                    console.log(req.session);
                    res.sendStatus(200);
                  });
              });
            }
          );
        });
      }});
    });
  }
  catch(err) {
    console.error('Error while verifying token', err);
    res.sendStatus(500);
  }
});



router.post('/linkgoogle', async function(req, res, next) {
  try {
    const ticket = await client.verifyIdToken({
        idToken: req.body.idtoken,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    //update the database with the userid
    req.pool.getConnection(function(err, connection){
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      var query = "UPDATE users SET api_token = ? WHERE user_id = ?";
      connection.query(query, [userid, req.session.user_id], function (error, rows, fields) {
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
  }
  catch(err) {
    console.error('Error while verifying token', err);
  }
});



router.post('/get_all_users', function(req, res, next) {

  if (!('user_id' in req.session) || !('user_role' in req.session) || (req.session.user_role !== 'admin')) {
      res.sendStatus(403);
  }

  req.pool.getConnection(function(err, connection) {
      if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
      }

      var query = "SELECT first_name, last_name, user_name, user_role, user_id FROM users WHERE user_id != ? ORDER BY first_name ASC;";
      connection.query(query, [req.session.user_id], function (err, rows, fields) {
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


router.post('/get_all_events', function(req, res, next) {

  if (!('user_id' in req.session) || !('user_role' in req.session) || (req.session.user_role !== 'admin')) {
      res.sendStatus(403);
  }

  req.pool.getConnection(function(err, connection) {
      if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
      }

      var query = "SELECT event.event_name, event.event_id, users.first_name, users.last_name FROM event INNER JOIN users ON users.user_id = event.creator_id ORDER BY event_name ASC;";
      connection.query(query, function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        console.log(rows[0]);
        res.json(rows); //send response
      });
  });
});


router.post('/delete_event', function(req, res, next) {

  if (!('user_id' in req.session)) {
    res.sendStatus(403);
  }

  req.pool.getConnection(function(err, connection) {
      if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
      }

      connection.query("DELETE FROM event WHERE event_id = ?;", [req.body.id], function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200)
      });
  });
});

router.post('/edit_event.html', function(req, res, next) {

  if (!('user_id' in req.session)) {
    res.sendStatus(403);
  }

  req.pool.getConnection(function(err, connection) {
      if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
      }

      connection.query("DELETE FROM event WHERE event_id = ?;", [req.body.id], function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200)
      });
  });
});

router.post('/get_email', function(req, res, next) {

    if (!('user_id' in req.session)) {
      res.sendStatus(403);
      return;
    }
    req.pool.getConnection(function(err, connection) {
        if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
        }

        connection.query("SELECT email FROM users WHERE user_id = ?;", [req.session.user_id], function (err, rows, fields) {
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


module.exports = router;





