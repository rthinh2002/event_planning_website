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
    var query = "SELECT first_name, last_name, email_address, email_notification_users_response, email_notification_event, email_notification_attendee, email_notification_cancelation FROM users WHERE user_id = 1;"
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

module.exports = router;
