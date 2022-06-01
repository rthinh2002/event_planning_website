var express = require('express');
const req = require('express/lib/request');
var router = express.Router();

/* GET home page. */
router.get('/hom.html', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Display user information - account.html - Peter update June 1st, 2022
router.get('/display_user_information', function(req, res, next){
  req.pool.getConnection(function(err, connection){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT first_name, last_name, email_address, DOB, email_notification_users_response, email_notification_event, email_notification_attendee, email_notification_cancelation FROM users WHERE user_id = 1;"
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

module.exports = router;
