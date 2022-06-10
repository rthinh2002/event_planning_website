const { application } = require('express');
var express = require('express');
var session = require('express-session');
const req = require('express/lib/request');
var router = express.Router();
var nodemailer = require('nodemailer');
const argon2 = require('argon2');
const sanitize = require('sanitize-html');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'sarai.stamm71@ethereal.email',
      pass: 'GXktnUSngkcad1hkDf'
  }
});

// send email to all guests
// if guest has a guest account, generate a random password and send with email
// if guest has a user account, direct them to web app to log in
router.post('/email_new_event', function(req, res, next) {

  req.pool.getConnection(async function(err, connection) {
    if(err) {
      connection.release();
      //console.log(err);
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
    connection.query("SELECT first_name, last_name, email_address FROM users WHERE user_id = ?;", [sanitize(req.session.user_id)], function (error, rows, fields) {

      if (error) {
        connection.release();
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
    connection.query("SELECT user_role FROM users WHERE email_address = ?;", [sanitize(req.body.guest_email)], function (error, rows, fields) {

      if (error) {
        connection.release();
        //console.log(error);
        return res.sendStatus(500);
      }

      if (rows.length === 0) {
        return res.sendStatus(500);
      } else if (rows[0].user_role === 'guest') {

        // add new account to database

        var query = "UPDATE users SET users.password = ? WHERE users.email_address = ?;";
        connection.query(query, [hash, sanitize(req.body.guest_email)], function (error, rows, fields) {
          connection.release();
          if (error) {
              return res.sendStatus(500);
            }
        });


        let info = transporter.sendMail({
          from: event_host.email_address,
          to: sanitize(req.body.guest_email),
          subject: "when2meet invitation",
          text: "Hi " + sanitize(req.body.guest_name) + "!" + event_host.first_name + " is inviting you to meet up!\n" +
                "Respond to " + sanitize(req.body.guest_name) + " at: when2meet/login.html?e_id=" + sanitize(req.body.event_id) + "\n" +
                "Your username is your email address, and your password to log in is: " + password,
          html: "<body><p>Hi " + sanitize(req.body.guest_name) + "!</p>" +
                "<p>" + event_host.first_name + " is inviting you to meet up!</p>" +
                "<p>Respond to " + event_host.first_name +
                " at: <a href=\"https://pianoman1986-code50-50366173-x7pqpjgw29946-8080.githubpreview.dev/login.html?e_id=" + sanitize(req.body.event_id) + "\">when2meet</a></p>" +
                "<p>Your username is your email address, and your password to log in is: " + password + "</p></body>"
        });
      } else {

        let info = transporter.sendMail({
          from: event_host.email_address,
          to: sanitize(req.body.guest_email),
          subject: "when2meet invitation",
          text: "Hi " + sanitize(req.body.guest_name) + "!" + event_host.first_name + " is inviting you to meet up!\n" +
                "Log in to your account to respond to " + sanitize(req.body.guest_name) + " at: when2meet.com/login.html\n",
          html: "<body><p>Hi " + sanitize(req.body.guest_name) + "!</p>" +
                "<p>" + event_host.first_name + " is inviting you to meet up!</p>" +
                "<p>Log in to your account to respond to " + event_host.first_name +
                " at: <a href=\"https://pianoman1986-code50-50366173-x7pqpjgw29946-8080.githubpreview.dev/login.html\">when2meet</a></p>"
        });
      }

      res.send();
    });
  });
});


var guests;
var event_details;
var event_dates;
var event_dates_email = '';

function prepareDates() {
  for (date in event_dates) {
    if (event_dates[dates].date_status) {
      event_dates_email += event_dates[dates].event_date + "\n" ;
    }
  }
}

module.exports = router;


/*

// BELOW INTENDED FOR INCOMPLETE EMAIL FEATURES

function sendConfirmationEmails() {

  prepareDates();
  if (guests.length !==0) {
    for (guest in guests) {
      let info = transporter.sendMail({
        from: event_host.email_address,
        to: sanitize(req.body.guest_email),
        subject: "when2meet event",
        text: "Hi " + guests[guest].first_name + "!" + "The following event has been confirmed!\n" +
              "Host: " + event_details[0].first_name + " " + event_details[0].last_name + "\n" +
              "Event name: " + event_details[0].event_name + "\n" +
              "Location: " + event_details[0].location + "\n" +
              "Details: " + event_details[0].event_description + "\n" +
              "Date/s: " + event_dates_email,
        html: "<body><p>Hi " + guests[guest].first_name + "!" + "The following event has been confirmed!</p>" +
              "<p>Host: " + event_details[0].first_name + " " + event_details[0].last_name + "\n" +
              "<br>Event name: " + event_details[0].event_name + "\n" +
              "<br>Location: " + event_details[0].location + "\n" +
              "<br>Details: " + event_details[0].event_description + "\n" +
              "<br>Date/s: " + event_dates_email + "</p>"
      });
    }
  }
}

router.post('/email_event_confirmation', function(req, res, next) {

  // get event details
  req.pool.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      //console.log(err);
      res.sendStatus(500);
      return;
    }

    var query1 = "SELECT * FROM event INNER JOIN users ON users.user_id = event.creator_id WHERE event_id = ?;";
    connection.query(query1, [sanitize(req.session.event_id)], function (error, rows, fields) {
      connection.release();
      if (error) {
        //console.log(error);
        return res.sendStatus(500);
      }
      if (rows.length === 0) {
        return res.sendStatus(500);
      } else {
        event_details = rows;
      }
    });
  });
  res.send();

  // get event dates
  req.pool.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      //console.log(err);
      res.sendStatus(500);
      return;
    }

    var query2 = "SELECT * FROM event_date WHERE event_id = ?;";
    connection.query(query2, [sanitize(req.session.event_id)], function (error, rows, fields) {
      connection.release();
      if (error) {
        //console.log(error);
        return res.sendStatus(500);
      }
      if (rows.length === 0) {
        return res.sendStatus(500);
      } else {
        event_dates = rows;
      }
    });
  });


  // get event attendees
  req.pool.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      //console.log(err);
      res.sendStatus(500);
      return;
    }

    // ADD QUERY TO LIST
    var query3 = "SELECT DISTINCT first_name, email_address FROM users INNER JOIN attendee ON users.user_id = attendee.user_id INNER JOIN event_date ON event_date.event_date_id = attendee.event_date_id WHERE event_date.event_id = ?;";
    connection.query(query3, [sanitize(req.session.event_id)], function (error, rows, fields) {
      connection.release();
      if (error) {
        //console.log(error);
        return res.sendStatus(500);
      }
      if (rows.length === 0) {
        return res.sendStatus(500);
      } else {
        guests = rows;

      }
    });
  });

  sendConfirmationEmails(guests);
  return;

});
*/

