const { application } = require('express');
var express = require('express');
var session = require('express-session');
const req = require('express/lib/request');
var router = express.Router();
var nodemailer = require('nodemailer');
const argon2 = require('argon2');


const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'sarai.stamm71@ethereal.email',
      pass: 'GXktnUSngkcad1hkDf'
  }
});


router.post('/email_new_event', function(req, res, next) {

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


        let info = transporter.sendMail({
          from: event_host.email_address,
          to: req.body.guest_email,
          subject: "when2meet invitation",
          text: "Hi " + req.body.guest_name + "!" + event_host.first_name + " is inviting you to meet up!\n" +
                "Respond to " + req.body.guest_name + " at: when2meet/login.html?e_id=" + req.body.event_id + "\n" +
                "Your username is your email address, and your password to log in is: " + password,
          html: "<body><p>Hi" + req.body.guest_name + "!</p>" +
                "<p>" + event_host.first_name + " is inviting you to meet up!</p>" +
                "<p>Respond to " + req.body.guest_name +
                " at: <a href=\"https://pianoman1986-code50-50366173-x7pqpjgw29946-8080.githubpreview.dev/login.html?e_id=" + req.body.event_id + "\">when2meet</a></p>" +
                "<p>our username is your email address, and your password to log in is: " + password + "</p></body>"
        });
      } else {

        let info = transporter.sendMail({
          from: event_host.email_address,
          to: req.body.guest_email,
          subject: "when2meet invitation",
          text: "Hi " + req.body.guest_name + "!" + event_host.first_name + " is inviting you to meet up!\n" +
                "Log in to your account to respond to " + req.body.guest_name + " at: when2meet.com/login.html\n",
          html: "<body><p>Hi " + req.body.guest_name + "!</p>" +
                "<p>" + event_host.first_name + " is inviting you to meet up!</p>" +
                "<p>Log in to your account to respond to " + req.body.guest_name +
                " at: <a href=\"https://pianoman1986-code50-50366173-x7pqpjgw29946-8080.githubpreview.dev/login.html\">when2meet</a></p>"
        });
      }

      res.send();
    });
  });
});

module.exports = router;
