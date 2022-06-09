const { application } = require('express');
var express = require('express');
var session = require('express-session');
const req = require('express/lib/request');
var router = express.Router();


// check user is admin - KG added 9/6/22
router.get('/', function(req, res, next) {
  if (!('user_role' in req.session) || (req.session.user_role !== 'admin')) {
      res.sendStatus(403);
  } else {
  next();
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

router.post('/make_admin', function(req, res, next) {

  if (!('user_id' in req.session) || !('user_role' in req.session) || (req.session.user_role !== 'admin')) {
      res.sendStatus(403);
  }

  req.pool.getConnection(function(err, connection) {
      if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
      }

      connection.query("UPDATE users SET user_role = 'admin' WHERE user_id = ?;", [req.body.id], function (err, rows, fields) {
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

router.post('/make_user', function(req, res, next) {

  if (!('user_id' in req.session) || !('user_role' in req.session) || (req.session.user_role !== 'admin')) {
      res.sendStatus(403);
  }

  req.pool.getConnection(function(err, connection) {
      if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
      }

      connection.query("UPDATE users SET user_role = 'user' WHERE user_id = ?;", [req.body.id], function (err, rows, fields) {
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

router.post('/delete_user', function(req, res, next) {

  // check that session is not missing user_role or user_id
  if (!('user_role' in req.session) || !('user_id' in req.session)) {
    res.sendStatus(403);
  // if present, check if user role admin
  } else if ( req.session.user_role !== 'admin') {
      // if user role is not admin, check that user is attempting to delete only their account
      if (req.session.user_id !== req.body.id) {
        res.sendStatus(403);
      }
  }

  req.pool.getConnection(function(err, connection) {
      if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
      }

      connection.query("DELETE FROM users WHERE user_id = ?;", [req.body.id], function (err, rows, fields) {
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

module.exports = router;
