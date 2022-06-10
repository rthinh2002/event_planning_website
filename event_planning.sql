-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: event_planning
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendee`
--
USE event_planning;
DROP TABLE IF EXISTS `attendee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendee` (
  `attendee_response` varchar(10) DEFAULT 'NONE',
  `user_id` int NOT NULL,
  `event_date_id` int NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `event_date_id` (`event_date_id`),
  CONSTRAINT `attendee_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `attendee_ibfk_2` FOREIGN KEY (`event_date_id`) REFERENCES `event_date` (`event_date_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendee`
--

LOCK TABLES `attendee` WRITE;
/*!40000 ALTER TABLE `attendee` DISABLE KEYS */;
INSERT INTO `attendee`
VALUES
('NONE','2','1'),
('NONE','3','1'),
('NONE','7','1'),
('NONE','2','2'),
('NONE','3','2'),
('NONE','7','2'),
('NONE','4','3'),
('NONE','9','3'),
('NONE','10','3'),
('NONE','3','3'),
('NONE','4','4'),
('NONE','9','4'),
('NONE','10','4'),
('NONE','3','4'),
('NONE','4','5'),
('NONE','9','5'),
('NONE','10','5'),
('NONE','3','5'),
('NONE','7','6'),
('NONE','5','6'),
('NONE','6','7'),
('NONE','1','7'),
('NONE','2','7'),
('NONE','6','8'),
('NONE','1','8'),
('NONE','2','8'),
('NONE','8','9'),
('NONE','2','9'),
('NONE','8','10'),
('NONE','2','10');
/*!40000 ALTER TABLE `attendee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES
('Event1_user_id_1','Description1','1','1','Location_1','2022-06-10',_binary '\0'),
('Event2_user_id_1','Description2','1','2','Location_2','2022-06-11',_binary '\0'),
('Event3_user_id_3','Description3','3','3','Location_3','2022-06-12',_binary '\0'),
('Event4_user_id_4','Description4','4','4','Location_4','2022-06-13',_binary '\0'),
('Event5_user_id_5','Description5','5','5','Location_5','2022-06-14',_binary '\0');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_date`
--

DROP TABLE IF EXISTS `event_date`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_date` (
  `event_date` datetime NOT NULL,
  `event_id` int NOT NULL,
  `date_status` bit(1) NOT NULL DEFAULT b'0',
  `event_date_id` int NOT NULL AUTO_INCREMENT,
  UNIQUE KEY `event_date_id` (`event_date_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_date_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_date`
--

LOCK TABLES `event_date` WRITE;
/*!40000 ALTER TABLE `event_date` DISABLE KEYS */;
INSERT INTO `event_date` VALUES
('2022-07-08 15:00:00','1',_binary '\0','1'),
('2022-07-16 17:00:00','1',_binary '\0','2'),
('2022-08-01 14:00:00','2',_binary '\0','3'),
('2022-08-02 18:00:00','2',_binary '\0','4'),
('2022-09-03 14:00:00','2',_binary '\0','5'),
('2022-09-27 05:00:00','3',_binary '\0','6'),
('2022-07-12 17:00:00','4',_binary '\0','7'),
('2022-07-13 17:00:00','4',_binary '\0','8'),
('2022-08-21 17:00:00','5',_binary '\0','9'),
('2022-08-22 17:00:00','5',_binary '\0','10');
/*!40000 ALTER TABLE `event_date` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
('Fname_admin1','Lname_admin1','email_admin1@email.com','$argon2i$v=19$m=4096,t=3,p=1$EROFlVVvGf9ta9fM54EHbg$LyEo78A0TP+syMAFX7D7RYgnteWknbwBGOJSFYv9A0w','admin1','admin','1',NULL,'2000-01-01',_binary '\1',_binary '\1',_binary '\1',_binary '\1'),
('Fname_admin2','Lname_admin2','email_admin2@email.com','$argon2i$v=19$m=4096,t=3,p=1$KIzw0sZuCVdAKfIoZrWDhw$LucJj9dUS6bgWMh9NXyY4o9q6sKmqQ77uKbKov0CAZA','admin2','admin','2',NULL,'2000-01-02',_binary '\0',_binary '\1',_binary '\0',_binary '\0'),
('Fname_user1','Lname_user1','email_user1@email.com','$argon2i$v=19$m=4096,t=3,p=1$71lQV1UzWdbG3SCusDOleg$p1SiaIh0F0JagB/Q9E7iCKnsz1isnkah2nJdRdk+A1E','user1','user','3',NULL,'2000-01-03',_binary '\0',_binary '\1',_binary '\1',_binary '\1'),
('Fname_user2','Lname_user2','email_user2@email.com','$argon2i$v=19$m=4096,t=3,p=1$jl4cr0wKZZLdePW5W+24Mg$A3ZnlRCfW4nPqY+zZIS6wdiqsfOqctiwjxo8NGFaMxs','user2','user','4',NULL,'2000-01-04',_binary '\1',_binary '\0',_binary '\1',_binary '\1'),
('Fname_user3','Lname_user3','email_user3@email.com','$argon2i$v=19$m=4096,t=3,p=1$QhhmW1K10st95KX7ZXurPA$QFLUszS0mCX28x1ewgQTafuB4tcoMezN/OZBE2j1j0Q','user3','user','5',NULL,'2000-01-05',_binary '\1',_binary '\0',_binary '\1',_binary '\0'),
('Fname_user4','Lname_user4','email_user4@email.com','$argon2i$v=19$m=4096,t=3,p=1$EHa7z3w12FM7m88raqScMg$xmY6Ftu0q3IwSV3NnLiKJ+bnYgO6/WT0R6nlMWxwrzo','user4','user','6',NULL,'2000-01-06',_binary '\0',_binary '\1',_binary '\0',_binary '\1'),
('Fname_guest1','Lname_guest1','email_guest1@email.com','$argon2i$v=19$m=4096,t=3,p=1$AR8vjqs8pJaI/ZtpS5933Q$KF4/KBig2DfkB7ZPUsY/1iC1BoWP+lnYDrxi5dPC15I','guest1','guest','7',NULL,'2000-01-07',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),
('Fname_guest2','Lname_guest2','email_guest2@email.com','$argon2i$v=19$m=4096,t=3,p=1$jvmLs4XOTXJ8XQaz7xSCgQ$Q+GkcNp7zK8R7D77lAZsvg6xvs4t2IA5FuVuNEwHt6U','guest2','guest','8',NULL,'2000-01-08',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),
('Fname_guest3','Lname_guest3','email_guest3@email.com','$argon2i$v=19$m=4096,t=3,p=1$Kubmo1NPC/xjlaZJZIfOyg$NawWmt/GFGy4VmpCH4m1IbozpKhawYlmn/Gmx4t/zbs','guest3','guest','9',NULL,'2000-01-09',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),
('Fname_guest4','Lname_guest4','email_guest4@email.com','$argon2i$v=19$m=4096,t=3,p=1$ZEFYT4BGlLzwWsrCYVzjcw$8RXHgcBPl5jYZdhE2buJptiuWpi1qvNq2YkUMLZwfFM','guest4','guest','10',NULL,'2000-01-10',_binary '\0',_binary '\0',_binary '\0',_binary '\0');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-08 19:13:54

