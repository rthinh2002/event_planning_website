const { application } = require('express');
var express = require('express');
var session = require('express-session');
const req = require('express/lib/request');
const sanitize = require('sanitize-html');
var router = express.Router();

// check user is logged in - KG added 9/6/22
router.get('/', function(req, res, next) {
  if (!('user_id' in req.session)) {
      res.sendStatus(403);
  } else {
  next();
  }
});

// get events hosted by the user - KG
router.post('/get_hosting_event', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      // console.log(err);
      res.sendStatus(500);
      return;
    }

    var user_id = req.session.user_id;
    //var query = "SELECT * FROM event WHERE creator_id = ? GROUP BY RSVP;";
    var query = "SELECT * FROM event WHERE creator_id = ? ORDER BY RSVP DESC;";
    connection.query(query, [sanitize(user_id)], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

// get events hosted by the user - KG last edited 8/6/22
router.post('/get_attending_event', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      // console.log(err);
      res.sendStatus(500);
      return;
    }
    var user_id = req.session.user_id;
    var query = "SELECT DISTINCT event.event_id, event.event_status, event.event_name, users.first_name, users.last_name \
                 FROM users INNER JOIN event ON users.user_id = event.creator_id \
                 INNER JOIN event_date ON event.event_id = event_date.event_id \
                 INNER JOIN attendee ON event_date.event_date_id = attendee.event_date_id \
                 WHERE attendee.user_id = ?;";
    connection.query(query, [sanitize(user_id)], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        // console.log(err);
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

// check if guest has existing account; if not, add guest account - KG last edited 8/6/22
router.post('/check_guest', function(req, res, next) {

    req.pool.getConnection(function(error, connection) {
      if (error) {
        // console.log(error); console.log("line 451");
        return res.sendStatus(500);
      }

      // check if user email exists - must be unique, so if not then user has no account
      connection.query("SELECT * FROM users WHERE email_address = ?;", [sanitize(req.body.email)], function (error, userRows, fields) {
        connection.release();
        if (error) {
          // console.log(error); console.log("line 459");
          return res.sendStatus(500);
        }

        if (userRows.length === 0) { 
          // console.log("no user");
          req.pool.getConnection(function(error, connection) {
            if (error) {
              // console.log(error); console.log("line 466");
              return res.sendStatus(500);
            }
            var queryNewUser = "INSERT INTO users (first_name, last_name, email_address, user_name, user_role) VALUES (?, ?, ?, ?, ?);";
            connection.query(queryNewUser, [sanitize(req.body.name), 'GUEST', sanitize(req.body.email), sanitize(req.body.email.substring(0,19)), 'guest'], function (error, rows, fields) {
              connection.release();
              if (error) {
                // console.log(error); console.log("line 473");
                return res.sendStatus(500);
              }
            });
          });
        } // end if-statement

      });
    });

  return res.sendStatus(200);
});

// add a new event to the database - KG last edited 8/6/22
router.post('/create_new_event', function(req, res, next) {
  // check a user is logged in

  if (!req.session.user_id) {
      // console.log("No user logged in to session");
      res.sendStatus(500);
      return;
  }

  // get connection
  req.pool.getConnection(function(error, connection) {
    if (error) {
      // console.log(error); console.log("line 487");
      return res.sendStatus(500);
    }
    // add new event to database
    var query = "INSERT INTO event (event_name, event_description, creator_id, location, RSVP) VALUES (?, ?, ?, ?, ?);";
    connection.query(query, [sanitize(req.body.eventName), sanitize(req.body.details), sanitize(req.session.user_id), sanitize(req.body.eventLocation), sanitize(req.body.rsvp)], function (error, rows, fields) {
      if (error) {
        connection.release(); 
        // console.log(error); console.log("line 494");
        return res.sendStatus(500);
      }
    });

    connection.query("SELECT LAST_INSERT_ID() AS id;", function (error, rows2, fields) {
      connection.release();
      if (error) {
        // console.log(error); console.log("line 494");
        return res.sendStatus(500);
      }
      res.json(rows2[0].id); //send response
    });
  });
});

// add date to an event - KG last edited 8/6/22
router.post('/add_event_date', function(req, res, next) {

  // console.log(req.body);
  req.pool.getConnection(function(error, connection) {
    if (error) {
      // console.log(error); console.log("line 487");
      return res.sendStatus(500);
    }

    connection.query("INSERT INTO event_date (event_date, event_id) VALUES (?, ?);", [sanitize(req.body.date), sanitize(req.body.event_id)], function (error, rows, fields) {
      connection.release();
      if (error) {
        // console.log("Unsuccessful date add"); console.log(error);
        return res.sendStatus(500);
      }

      req.pool.getConnection(function(error, connection) {
        if (error) {
          // console.log(error); console.log("line 487");
          return res.sendStatus(500);
        }

        connection.query("SELECT LAST_INSERT_ID() AS id;", function (error, rows, fields) {
          connection.release();
          if (error) {
            // console.log(error); console.log("line 494");
            return res.sendStatus(500);
          }
          res.json(rows[0].id); //send response
        });
      });
    });
  });
});

// add attendee to an event - KG last edited 8/6/22
router.post('/add_event_attendee', function(req, res, next) {

  // console.log(req.body);
  req.pool.getConnection(function(error, connection) {
    if (error) {
      // console.log(error); console.log("line 487");
      return res.sendStatus(500);
    }

    var query = "INSERT INTO attendee (user_id, event_date_id) \
                 VALUES ((SELECT user_id FROM users WHERE email_address = ?), \
                         (SELECT event_date_id FROM event_date WHERE event_date = ? AND event_id = ?));";
    connection.query(query, [sanitize(req.body.email), sanitize(req.body.date), sanitize(req.body.event_id)], function (error, rows, fields) {
      connection.release();
      if (error) {
        // console.log("Unsuccessful date add"); console.log(error);
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });
});

// delete event from database - KG last edited 8/6/22
router.post('/delete_event', function(req, res, next) {

  if (!('user_id' in req.session)) {
    return res.sendStatus(403);
  }

  req.pool.getConnection(function(err, connection) {
    if(err) {
      //console.log(err);
      return res.sendStatus(500);
    }

    // check that the user is authorised to delete even, i.e. the user owns the event, or is an admin
    connection.query("SELECT event_id FROM event WHERE event_id = ? && creator_id = ?;", [sanitize(req.body.id), sanitize(req.session.user_id)], function (err, rows, fields) {
      connection.release();
      if (err) {
        // console.log(err);
        return res.sendStatus(500);
      }

      // if not authorised, send Forbidden response
      if (rows.length === 0 && !req.session.role !== 'admin') {
        return res.sendStatus(403);
      } else {
        // if authorised, delete event
        req.pool.getConnection(function(err, connection) {
          if(err) {
            //console.log(err);
            return res.sendStatus(500);
          }

          connection.query("DELETE FROM event WHERE event_id = ?;", [sanitize(req.body.id)], function (err, rows, fields) {
            connection.release();
            if (err) {
              //console.log(err);
              return res.sendStatus(500);
            }
            return res.sendStatus(200);
          });
        });
      }
    });

  });
});

// delete event from database - KG last edited 8/6/22
router.post('/edit_event.html', function(req, res, next) {

  if (!('user_id' in req.session)) {
    res.sendStatus(403);
  }

  req.pool.getConnection(function(err, connection) {
      if(err) {
      // console.log(err);
      res.sendStatus(500);
      return;
      }

      connection.query("DELETE FROM event WHERE event_id = ?;", [sanitize(req.body.id)], function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          // console.log(err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
  });
});

module.exports = router;
