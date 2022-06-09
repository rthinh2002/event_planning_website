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
INSERT INTO `attendee` VALUES ('YES',2,51),('YES',2,54);
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
INSERT INTO `event` VALUES ('The Day of Dancing Around','Nothing special, just dancing around',1,1,'Adelaide Glenelgh','2022-01-05'),('Sing till Death','Just sing lol',1,2,'Botanic Garden','2022-06-15'),('Going to the Moon','I dont know cuz we will just fly to the moon and back',1,3,'NASA','2022-06-09');
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
INSERT INTO `event_date` VALUES ('2022-06-22 00:00:00',2,_binary '',7),('2022-06-23 00:00:00',2,_binary '',8),('2022-06-02 19:35:00',1,_binary '',51),('2022-06-22 19:35:00',1,_binary '\0',54),('2022-06-09 09:57:00',4,_binary '\0',55);
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
INSERT INTO `users` VALUES ('Peter','Le','rthinh2002@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$m7w2o9qH7StTS2uim3Efsw$jX4ce7OOgPIKY3wwtpWnzHLxgkRwixADNJJPEOc8bwI','peterle','admin',1,'rasdfasdfasdr-gasdf','2005-06-19',_binary '',_binary '',_binary '',_binary ''),('Josh','NoGay','hjosh@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$2eem+yixp2eeXgYxLYT2qA$Zsg+pf+ze+3Smheg7HzSIHhJPZUYPOmjZNVFHTW3J60','joshgie','user',2,'sds-gasdf','1997-05-02',_binary '',_binary '',_binary '',_binary '');
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
