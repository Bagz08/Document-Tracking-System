-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dts_db
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `office_docs`
--

DROP TABLE IF EXISTS `office_docs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `office_docs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dts_number` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `doc_type` varchar(100) DEFAULT NULL,
  `registered_by` varchar(100) DEFAULT NULL,
  `status` enum('received','forwarded','ended') DEFAULT 'received',
  `date_registered` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ai_category` varchar(100) DEFAULT NULL,
  `ai_confidence` decimal(5,2) DEFAULT NULL,
  `ai_override_by` varchar(100) DEFAULT NULL,
  `ai_override_at` datetime DEFAULT NULL,
  `ai_override_reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dts_number` (`dts_number`),
  KEY `registered_by` (`registered_by`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office_docs`
--

LOCK TABLES `office_docs` WRITE;
/*!40000 ALTER TABLE `office_docs` DISABLE KEYS */;
INSERT INTO `office_docs` VALUES (1,'2025004001','Renewal of Facilities Maintenance Contract – FY2025','Request to renew the CleanBuild Facilities service agreement for janitorial and grounds upkeep.','Administration and Finance','zhanzan.helloworld','received','2025-05-22 08:56:00','Administration and Finance: Procurement & Supplies',0.04,NULL,NULL,NULL),(2,'2025004002','Community Literacy Caravan – Barangay Hinaplanon','Program brief assigning faculty to conduct weekend reading sessions and teacher coaching in Hinaplanon.','Research and Extension','zhanzan.helloworld','forwarded','2025-03-21 03:27:00','Research and Extension: Community & Extension Services',0.06,NULL,NULL,NULL),(3,'2025004003','Student Discipline Case Summary – 1st Semester','Consolidated report of resolved student discipline cases with sanctions and policy recommendations.','Student Services','zhanzan.helloworld','ended','2025-02-03 06:38:00','Student Services: Student Organizations & Activities',0.08,NULL,NULL,NULL),(4,'2025004004','Supplemental Budget Request – ICT Upgrades','Proposal to reallocate ₱2.5M for urgent data-center hardware refresh and network redundancy upgrades.','Administration and Finance','zhanzan.helloworld','received','2025-07-09 13:29:00','Research and Extension: Community & Extension Services',0.05,NULL,NULL,NULL),(5,'2025004005','Ethics Clearance Request – Community Health Survey','Protocol submission requesting ethics approval for household health interviews with minors.','Research and Extension','zhanzan.helloworld','forwarded','2025-03-12 15:51:00','Research and Extension: Research Ethics & Data Privacy',0.11,NULL,NULL,NULL),(6,'2025004006','Teaching Load Redistribution – Math Department','Worksheet reallocating lecture and lab sections after Prof. Gomez goes on sabbatical.','Academics','zhanzan.helloworld','received','2025-07-22 17:19:00','Academics: Faculty Workload & Assignments',0.08,NULL,NULL,NULL),(7,'2025004007','MOA with Rotary Club for Leadership Trainings','Draft memorandum for joint leadership bootcamps for student officers with Rotary Club Iligan.','Student Services','zhanzan.helloworld','forwarded','2025-06-19 19:22:00','Student Services: Student Organizations & Activities',0.08,NULL,NULL,NULL),(8,'2025004008','FabLab Preventive Maintenance Schedule Q1','Checklist and tooling calibration plan for Fabrication Laboratory operations in Q1 2025.','Research and Extension','zhanzan.helloworld','ended','2025-05-13 02:43:00','Student Services: Scholarships & Financial Assistance',0.06,NULL,NULL,NULL),(9,'2025004009','SCHOLAR Grant Renewal List AY2025','Verified list of continuing scholarship grantees with updated stipend release schedule.','Student Services','zhanzan.helloworld','received','2025-08-11 20:01:00','Student Services: Scholarships & Financial Assistance',0.13,NULL,NULL,NULL),(10,'2025005001','Disbursement Voucher – Equipment Lease','Payment processing for quarterly lease of multifunction printers for OC and HRMO.','Administration and Finance','samuel.kirit','received','2025-04-07 16:09:00','Student Services: Scholarships & Financial Assistance',0.06,NULL,NULL,NULL),(11,'2025005002','Reimbursement – Faculty Mobility Grant','Liquidation of Prof. Reyes travel expenses under the faculty mobility program.','Administration and Finance','samuel.kirit','forwarded','2025-01-25 05:28:00','Research and Extension: International Affairs & Linkages',0.06,NULL,NULL,NULL),(12,'2025005003','Cash Advance Liquidation – ASEAN Summit','Liquidation package for delegation attending the ASEAN Summit in Singapore.','Administration and Finance','glainarose.arquillos','ended','2025-04-18 04:56:00','Administration and Finance: Travel & Liquidations',0.08,NULL,NULL,NULL),(13,'2025005004','Per Diem Request – Outreach Caravan','Per diem request covering facilitators for the Mindanao outreach caravan.','Administration and Finance','glainarose.arquillos','received','2025-10-20 05:38:00','Research and Extension: Community & Extension Services',0.06,NULL,NULL,NULL),(14,'2025005005','Application for Extended Sick Leave – Prof. Luz','Supporting documents for extended sick leave from Jan 20 to Feb 10.','Administration and Finance','khaled.dalupang','received','2025-05-25 04:03:00','Administration and Finance: Human Resources (Leave Administration)',0.18,NULL,NULL,NULL),(15,'2025005006','Compensatory Leave Approval – HR Staff','HRMO endorsement of compensatory leave credits earned during year-end rush.','Administration and Finance','khaled.dalupang','forwarded','2025-01-26 12:53:00','Administration and Finance: Human Resources (Leave Administration)',0.11,NULL,NULL,NULL),(16,'2025005007','Justification of No Time In/Out – December 15','Explanation for biometric anomalies of Finance personnel on Dec 15.','Administration and Finance','glainarose.arquillos','received','2024-12-27 10:11:00','Administration and Finance: Human Resources (Timekeeping & Attendance)',0.21,NULL,NULL,NULL),(17,'2025005008','Overtime Log Validation – Payroll Cutoff','Attendance validation for staff completing payroll cutoff overtime.','Administration and Finance','glainarose.arquillos','forwarded','2025-03-25 08:24:00','Administration and Finance: Payroll Processing',0.07,NULL,NULL,NULL),(18,'2025005009','PPMP for Science Lab Consumables','Planned procurement list for chemicals and glassware for AY 2025.','Administration and Finance','sittieshaima.baniaga','received','2025-11-12 12:16:00','Administration and Finance: Procurement & Supplies',0.09,NULL,NULL,NULL),(19,'2025005010','RFQ – Auditorium Audio Upgrade','Request for quotation covering mixers, speakers, and installation services.','Administration and Finance','sittieshaima.baniaga','forwarded','2025-02-09 16:51:00','Planning and Development: Infrastructure & Physical Facilities',0.06,NULL,NULL,NULL),(20,'2025005011','Payroll Register – January 1–15 Staff','Summary payroll register for staff salaries, deductions, and net pay.','Administration and Finance','khaled.dalupang','ended','2025-09-07 01:28:00','Administration and Finance: Payroll Processing',0.11,NULL,NULL,NULL),(21,'2025005012','Midyear Bonus Computation Sheet','Calculation worksheet for midyear bonuses and corresponding funding source.','Administration and Finance','khaled.dalupang','received','2025-10-09 19:19:00','Student Services: Student Organizations & Activities',0.05,NULL,NULL,NULL),(22,'2025005013','Progress Report – Bamboo Innovation Project','Quarterly milestone update, outputs, and variance analysis for bamboo R&D.','Research and Extension','acmida.dagalangit','forwarded','2025-08-13 00:52:00','Planning and Development: Infrastructure & Physical Facilities',0.08,NULL,NULL,NULL),(23,'2025005014','Site Inspection Memo – Renewable Energy Hub','Memo scheduling field validation for the Renewable Energy Hub project components.','Research and Extension','acmida.dagalangit','received','2025-07-10 20:48:00','Planning and Development: Infrastructure & Physical Facilities',0.10,NULL,NULL,NULL);
/*!40000 ALTER TABLE `office_docs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','viewer') DEFAULT 'viewer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$uo4/jCZSUPZstsXuJmmw2.BcwirWF1f10RcQz7KE0pOgURB711u0G','admin');
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

-- Dump completed on 2025-11-18  8:17:18
