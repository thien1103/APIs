-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: testapi
-- ------------------------------------------------------
-- Server version	8.0.35

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
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `contactId` int NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `category` varchar(45) NOT NULL,
  `avatar` blob,
  PRIMARY KEY (`contactId`),
  UNIQUE KEY `contactId_UNIQUE` (`contactId`),
  UNIQUE KEY `phoneNumber_UNIQUE` (`phoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,'0123456789','John Doe','Nhà trường',_binary 'C:/Users/NHIEN/OneDrive/Hình ảnh/capybara'),(2,'0987654321','Jane Smith','Ứng dụng Starkid',_binary 'C:/Users/NHIEN/OneDrive/Hình ảnh/pikachu2');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `healthpost`
--

DROP TABLE IF EXISTS `healthpost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `healthpost` (
  `postId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `content` varchar(200) NOT NULL,
  `image` blob NOT NULL,
  PRIMARY KEY (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `healthpost`
--

LOCK TABLES `healthpost` WRITE;
/*!40000 ALTER TABLE `healthpost` DISABLE KEYS */;
INSERT INTO `healthpost` VALUES (1,'Cách phòng tránh bệnh cho trẻ','Có rất nhiều phương pháp phòng bệnh cho trẻ điển hình như tiêm vắc xin, bổ sung vitamin',_binary 'C:/Users/NHIEN/OneDrive/Hình ảnh/hinh-nen-cho-may-tinh-de-thuong-1.png'),(2,'Bài đăng 2','Nội dung của bài đăng 2 ở đây',_binary 'C:/Users/NHIEN/OneDrive/Hình ảnh/1672284831_844_100-hinh-nen-chat-luong-full-HD-4k-cuc-dep');
/*!40000 ALTER TABLE `healthpost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notificationId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `dateTime` datetime NOT NULL,
  `images` blob NOT NULL,
  `content` varchar(200) NOT NULL,
  PRIMARY KEY (`notificationId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'Thông báo 1','2024-03-28 10:00:00',_binary '[\"C:/Users/NHIEN/OneDrive/Hình ảnh/pikachu2\"]','Nội dung thông báo 1'),(2,'Thông báo 2','2024-03-27 15:30:00',_binary '[\"C:/Users/NHIEN/OneDrive/Hình ảnh/pikachu2\"]','Nội dung thông báo 2');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pickups`
--

DROP TABLE IF EXISTS `pickups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pickups` (
  `pickupId` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(45) NOT NULL,
  `phoneNumber` varchar(45) NOT NULL,
  `relationship` varchar(45) NOT NULL,
  `idNumber` varchar(45) DEFAULT NULL,
  `action` varchar(45) NOT NULL,
  `note` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`pickupId`),
  UNIQUE KEY `pickupId_UNIQUE` (`pickupId`),
  UNIQUE KEY `phoneNumber_UNIQUE` (`phoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pickups`
--

LOCK TABLES `pickups` WRITE;
/*!40000 ALTER TABLE `pickups` DISABLE KEYS */;
INSERT INTO `pickups` VALUES (1,'1','0123456789','Ba','023923AB','Đưa','Ghi chú về đưa đón'),(2,'2','0982382','Mẹ','220131ME','Đón','Ghi chú về đưa đón');
/*!40000 ALTER TABLE `pickups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `requestId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `startDateTime` datetime NOT NULL,
  `endDateTime` datetime NOT NULL,
  `content` varchar(200) NOT NULL,
  `status` varchar(45) NOT NULL,
  `userId` varchar(45) NOT NULL,
  PRIMARY KEY (`requestId`),
  UNIQUE KEY `requestId_UNIQUE` (`requestId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
INSERT INTO `requests` VALUES (1,'Xin nghỉ phép','2024-03-30 08:00:00','2024-03-31 17:00:00','Xin nghỉ phép vì lý do cá nhân','Chưa xác nhận','1'),(2,'Xin nghỉ phép','2024-03-30 08:00:00','2024-03-31 17:00:00','Xin nghỉ phép vì bệnh','Chưa xác nhận','2');
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `phoneNumber` int NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(45) NOT NULL,
  `sex` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  `parent_name` varchar(45) NOT NULL,
  `parent_phone` varchar(45) NOT NULL,
  `parent_email` varchar(45) NOT NULL,
  `mother_name` varchar(45) NOT NULL,
  `mother_phone` varchar(45) NOT NULL,
  `mother_email` varchar(45) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `phoneNumber_UNIQUE` (`phoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,945181222,'$2b$10$sFFZYQ4seu3Eo3b0vQn55.CWmXXL68p2IiYzKQdiGWkCEUmHerFIW','John Doe','john.doe37@example.com','male','123 Main Street, City, Country','Jack Doe','0123456789','jack21.doe@example.com','Janifer Doe','0987654321','janifer.doe@example.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-20 16:45:12
