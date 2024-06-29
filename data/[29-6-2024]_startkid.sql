-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: mysql-startkid-startkid.d.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.0.30

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '746bed4d-2f75-11ef-a998-dee432d30c73:1-102';

--
-- Table structure for table `blacklisted_tokens`
--

DROP TABLE IF EXISTS `blacklisted_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklisted_tokens` (
  `tokenId` int NOT NULL AUTO_INCREMENT,
  `token` longtext NOT NULL,
  PRIMARY KEY (`tokenId`),
  UNIQUE KEY `tokenId_UNIQUE` (`tokenId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklisted_tokens`
--

LOCK TABLES `blacklisted_tokens` WRITE;
/*!40000 ALTER TABLE `blacklisted_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `blacklisted_tokens` ENABLE KEYS */;
UNLOCK TABLES;

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
  `avatar` varchar(200) DEFAULT NULL,
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
INSERT INTO `contact` VALUES (1,'0123456789','John Doe','Nhà trường','https://www.multyskill.co.za/wp-content/uploads/2018/12/team_2.jpg'),(2,'0987654321','Jane Smith','Ứng dụng Starkid','https://onlinegcsemathstutor.com/wp-content/uploads/2020/02/me-e1581852735403.jpg');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `healthPost`
--

DROP TABLE IF EXISTS `healthPost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `healthPost` (
  `postId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `image` varchar(200) NOT NULL,
  PRIMARY KEY (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `healthPost`
--

LOCK TABLES `healthPost` WRITE;
/*!40000 ALTER TABLE `healthPost` DISABLE KEYS */;
INSERT INTO `healthPost` VALUES (1,'Các phương pháp phòng tránh bệnh cho trẻ','Hiện nay có rất nhiều phương pháp phòng tránh bệnh cho trẻ. Tuy nhiên, các cách phổ biến nhất là: rửa tay thường xuyên, đeo khẩu trang nơi công cộng, mặc ấm khi trời lạnh, ...','https://image.infographics.vn/media//Graphic/Org/2019/05/24/2019-5-21-benh-mua-he-tre-em-ruby.jpg'),(2,'Giáo dục trẻ đúng cách','Tất cả chúng ta đều muốn trở thành những tấm gương tốt để con cái mình noi theo. Ai cũng mong con mình sẽ trở thành đứa trẻ ngoan, thông minh, tài giỏi và có khả năng tự lập. Ba mẹ chính là chìa khóa vàng trong suốt quá trình nuôi dạy con cái. Phương pháp nuôi dạy của ba mẹ sẽ có ảnh hưởng lớn tới tính cách cũng như hành vi của trẻ sau này. Chính vì vậy, ngay từ khi con còn nhỏ, ba mẹ nên quan sát và tìm ra các nguyên tắc phù hợp để nuôi dạy con đúng cách...','http://readysteadygokids.edu.vn/wp-content/uploads/2023/08/nuoi-day-con-dung-cach-2.png'),(3,'Bữa ăn an toàn và giàu dinh dưỡng cho trẻ','Nhận thức rõ tầm quan trọng của ATTP, trường học có bếp ăn tập thể trang bị đầy đủ các thiết bị, dụng cụ, bảo đảm bếp ăn an toàn. Trường còn chú trọng trong khâu lựa chọn thực phẩm, bảo đảm nguồn nước sử dụng, chú ý thời gian sử dụng thức ăn, hướng dẫn HS rửa tay trước khi ăn,...','https://pathway.edu.vn/wp-content/uploads/2023/04/bua-an-dinh-duong-cho-con-2.jpg');
/*!40000 ALTER TABLE `healthPost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notificationId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `dateTime` datetime NOT NULL,
  `images` varchar(200) NOT NULL,
  `content` varchar(1000) NOT NULL,
  PRIMARY KEY (`notificationId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'Thông báo lịch nghỉ Tết','2024-01-25 10:30:00','https://ducvietco.com/data/media/346/images/f50c152c7848dac24210d3ad3ad22154_XL.jpg','Ngày 22/11/2023, Bộ LĐTB&XH có Thông báo 5015/TB-LĐTBXH về việc nghỉ Tết Âm lịch và nghỉ lễ Quốc khánh năm 2024 đối với cán bộ, công chức, viên chức và người lao động.'),(2,'Thông báo lịch nghỉ hè','2024-06-26 15:45:00','https://everestschool.edu.vn//data/source/news/2024/thang5/saigon-academy-thong-bao-nghi-he-1.jpg','Kế hoạch này được xây dựng bám theo Quyết định 2171/QĐ-BGDĐT về khung kế hoạch thời gian năm học 2023 -2024 đối với giáo dục mầm non, giáo dục phổ thông và giáo dục thường xuyên do Bộ GD&ĐT ban hành.');
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
INSERT INTO `pickups` VALUES (1,'1','0923456789','Ba','ABC123XYZ','Đưa','Ghi chú mới về đưa đón'),(2,'2','0982382322','Mẹ','220131ME','Đón','Ghi chú về đưa đón');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,945181222,'$2b$10$sFFZYQ4seu3Eo3b0vQn55.CWmXXL68p2IiYzKQdiGWkCEUmHerFIW','John Doe','john.doe37@example.com','male','123 Main Street, City, Country','Jack Doe','0123456789','jack21.doe@example.com','Janifer Doe','0987654321','janifer.doe@example.com'),(2,987654321,'$2b$10$dneQuBwgrtb/2Af9dyh9F.9po5QBCO6QLRQHNwrB5MktSa0ZYa1C6','Tester 1','tester@gmail.com','male','172 Quang Trung','Van Hoang','09298727','vanhoang22@gmail.com','Thuy Tien','09988822','tthuytien@gmail.com'),(4,987654322,'$2b$10$O2qgazC803AJhLA3UZMKueV7ljGzAQmjiwO.gpK74xD/soLahRfam','Tester 1','tester@gmail.com','male','172 Quang Trung','Van Hoang','09298727','vanhoang22@gmail.com','Thuy Tien','09988822','tthuytien@gmail.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-29 11:50:56
