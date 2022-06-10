USE event_planning;
CREATE TABLE `attendee` (
  `attendee_response` varchar(10) DEFAULT 'NONE',
  `user_id` int NOT NULL,
  `event_date_id` int NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `event_date_id` (`event_date_id`),
  CONSTRAINT `attendee_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `attendee_ibfk_2` FOREIGN KEY (`event_date_id`) REFERENCES `event_date` (`event_date_id`) ON DELETE CASCADE
);

CREATE TABLE `event` (
  `event_name` varchar(100) DEFAULT NULL,
  `event_description` text,
  `creator_id` int NOT NULL,
  `event_id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(30) DEFAULT NULL,
  `RSVP` date DEFAULT NULL,
  `event_status` bit(1) DEFAULT b'0',
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `event_id` (`event_id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE `event_date` (
  `event_date` datetime NOT NULL,
  `event_id` int NOT NULL,
  `date_status` bit(1) NOT NULL DEFAULT b'0',
  `event_date_id` int NOT NULL AUTO_INCREMENT,
  UNIQUE KEY `event_date_id` (`event_date_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_date_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE CASCADE
);

CREATE TABLE `users` (
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `email_address` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `user_role` varchar(6) DEFAULT NULL,
  `user_id` int NOT NULL AUTO_INCREMENT,
  `api_token` varchar(100) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `email_notification_users_response` bit(1) NOT NULL DEFAULT b'0',
  `email_notification_event` bit(1) NOT NULL DEFAULT b'0',
  `email_notification_attendee` bit(1) NOT NULL DEFAULT b'0',
  `email_notification_cancelation` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `api_token` (`api_token`),
  UNIQUE KEY `email_address` (`email_address`)
);

Draft Queries:
/email: 
SELECT first_name, last_name, email_address 
FROM users WHERE user_id = ?;
SELECT user_role 
FROM users 
WHERE email_address = ?;

/home.html:
SELECT user_id, user_role, password 
FROM users 
WHERE user_name = ? AND user_role != 'guest';

/get_user_details:
SELECT first_name, user_role 
FROM users 
WHERE user_id = ?;

/createaccount:
INSERT INTO users (first_name, last_name, email_address, user_name, password, user_role) 
VALUES (?, ?, ?, ?, ?, ?);
SELECT user_id 
FROM users 
WHERE user_id = LAST_INSERT_ID();

/display_user_information:
SELECT first_name, last_name, email_address, DOB, email_notification_users_response, email_notification_event, email_notification_attendee, email_notification_cancelation 
FROM users 
WHERE user_id = ?;

/change_user_info:
UPDATE users 
SET first_name = ?, last_name = ?, email_address = ?, DOB = ?, email_notification_users_response = ?, email_notification_event = ?, email_notification_attendee = ?, email_notification_cancelation = ? 
WHERE user_id = ?;

/display_event_info:
SELECT event_date.date_status, event_date.event_date_id, event.event_name, event.event_description, event.location, event.RSVP, event_date.event_date 
FROM event 
INNER JOIN event_date ON creator_id = ? && event.event_id = ? && event.event_id = event_date.event_id;

/display_event_info_invite:
SELECT users.first_name, event_date.date_status, event_date.event_date_id, event.event_name, event.event_description, event.location, event.RSVP, event_date.event_date, attendee.attendee_response 
FROM event 
INNER JOIN users ON users.user_id = event.creator_id 
INNER JOIN event_date ON event.event_id = event_date.event_id INNER JOIN attendee ON event_date.event_date_id = attendee.event_date_id 
WHERE event.event_id = ? AND attendee.user_id = ?;

/display_attendee:
SELECT DISTINCT users.first_name, users.email_address, users.user_id 
FROM users 
INNER JOIN attendee ON attendee.user_id = users.user_id 
INNER JOIN event_date on attendee.event_date_id = event_date.event_date_id 
WHERE event_date.event_id = ?;

/get_hosting_event:
SELECT * FROM event 
WHERE creator_id = ? ORDER BY RSVP DESC;

/get_attending_event:
SELECT DISTINCT event.event_id, event.event_status, event.event_name, users.first_name, users.last_name \
FROM users INNER JOIN event ON users.user_id = event.creator_id \
INNER JOIN event_date ON event.event_id = event_date.event_id \
INNER JOIN attendee ON event_date.event_date_id = attendee.event_date_id \
WHERE attendee.user_id = ?;

/delete_date:
DELETE FROM event_date WHERE event_date_id = ?;

/update_date_status:
UPDATE event_date SET date_status = 1 WHERE event_date_id = ?;

/save_event_info:
UPDATE event SET event_name = ?, event_description = ?, location = ?, RSVP = ? WHERE event_id = ?;

/save_event_date:
INSERT INTO event_date(event_date, event_id) VALUES ( ?, ? ); SELECT event_date_id FROM event_date WHERE event_date = ? AND event_id = ?;

/save_event_attendee_date:
INSERT INTO attendee(user_id, event_date_id) VALUES(?, ?);

/save_event_attendee:
INSERT INTO attendee(user_id, event_date_id) VALUES((SELECT user_id FROM users WHERE first_name = ? AND email_address = ?), ?);

/get_attendee:
SELECT attendee.attendee_response, users.first_name FROM attendee INNER JOIN users ON users.user_id = attendee.user_id WHERE event_date_id = ?;

/invited:
SELECT event_description, location, RSVP FROM event WHERE event_id = ?;

/check_guests:
SELECT * FROM users WHERE email_address = ?;
INSERT INTO users (first_name, last_name, email_address, user_name, user_role) VALUES (?, ?, ?, ?, ?);

/create_new_event:
INSERT INTO event (event_name, event_description, creator_id, location, RSVP) VALUES (?, ?, ?, ?, ?);
SELECT LAST_INSERT_ID() AS id;

/add_event_date:
INSERT INTO attendee (user_id, event_date_id) \
VALUES ((SELECT user_id FROM users WHERE email_address = ?), \
(SELECT event_date_id FROM event_date WHERE event_date = ? AND event_id = ?));

/tokensignin:
SELECT users.user_id FROM users WHERE users.api_token = ?
INSERT INTO users (user_name, email_address, first_name, last_name, api_token, password, user_role) VALUES (?, ?, ?, ?, ?, ?, ?);
SELECT users.user_id FROM users WHERE users.api_token = ?

/linkgoogle:
UPDATE users SET api_token = ? WHERE user_id = ?;

/get_all_users:
SELECT first_name, last_name, user_name, user_role, user_id FROM users WHERE user_id != ? ORDER BY first_name ASC;

/get_all_events:
SELECT event.event_name, event.event_id, users.first_name, users.last_name FROM event INNER JOIN users ON users.user_id = event.creator_id ORDER BY event_name ASC;

/delete_event:
DELETE FROM event WHERE event_id = ?;

/edit_event.html:
DELETE FROM event WHERE event_id = ?;

/get_email:
SELECT email_address, api_token FROM users WHERE user_id = ?;

/get_hosting_event:
SELECT * FROM event WHERE creator_id = ? ORDER BY RSVP DESC;

/get_attending_event:
SELECT DISTINCT event.event_id, event.event_status, event.event_name, users.first_name, users.last_name \
FROM users INNER JOIN event ON users.user_id = event.creator_id \
INNER JOIN event_date ON event.event_id = event_date.event_id \
INNER JOIN attendee ON event_date.event_date_id = attendee.event_date_id \
WHERE attendee.user_id = ?;

/check_guest:
SELECT * FROM users WHERE email_address = ?;

/add_event_date:
INSERT INTO event_date (event_date, event_id) VALUES (?, ?);

/add_event_attendee:
INSERT INTO attendee (user_id, event_date_id) \
VALUES ((SELECT user_id FROM users WHERE email_address = ?), \
(SELECT event_date_id FROM event_date WHERE event_date = ? AND event_id = ?));

/delete_event:
SELECT event_id FROM event WHERE event_id = ? && creator_id = ?
DELETE FROM event WHERE event_id = ?;

/get_all_users:
SELECT first_name, last_name, user_name, user_role, user_id FROM users WHERE user_id != ? ORDER BY first_name ASC;

/get_all_events:
SELECT event.event_name, event.event_id, users.first_name, users.last_name FROM event INNER JOIN users ON users.user_id = event.creator_id ORDER BY event_name ASC;

/make_admin:
UPDATE users SET user_role = 'admin' WHERE user_id = ?;

/make_user:
UPDATE users SET user_role = 'user' WHERE user_id = ?;

/delete_user:
DELETE FROM users WHERE user_id = ?;