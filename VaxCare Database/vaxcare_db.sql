-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 07:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vaxcare_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `vaccine_id` int(11) DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `status` enum('Scheduled','Completed','Missed') DEFAULT 'Scheduled',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `patient_id`, `vaccine_id`, `appointment_date`, `status`, `created_at`) VALUES
(1, 1, 1, '2024-03-20 09:00:00', 'Scheduled', '2025-05-21 04:22:59'),
(2, 2, 2, '2024-03-21 10:30:00', 'Scheduled', '2025-05-21 04:22:59'),
(3, 3, 3, '2024-03-22 14:00:00', 'Scheduled', '2025-05-21 04:22:59'),
(4, 1, 1, '2024-03-20 09:00:00', 'Scheduled', '2025-05-21 04:42:37'),
(5, 2, 2, '2024-03-21 10:30:00', 'Scheduled', '2025-05-21 04:42:37'),
(6, 3, 3, '2024-03-22 14:00:00', 'Scheduled', '2025-05-21 04:42:37'),
(7, NULL, NULL, '0000-00-00 00:00:00', 'Scheduled', '2025-05-21 04:45:06'),
(8, 1, 1, '2024-03-20 09:00:00', 'Scheduled', '2025-05-21 04:48:47'),
(9, 2, 2, '2024-03-21 10:30:00', 'Scheduled', '2025-05-21 04:48:47'),
(10, 3, 3, '2024-03-22 14:00:00', 'Scheduled', '2025-05-21 04:48:47'),
(11, 1, 1, '2024-03-20 09:00:00', 'Scheduled', '2025-05-21 04:57:31'),
(12, 2, 2, '2024-03-21 10:30:00', 'Scheduled', '2025-05-21 04:57:31'),
(13, 3, 3, '2024-03-22 14:00:00', 'Scheduled', '2025-05-21 04:57:31'),
(14, 1, 1, '2024-03-20 09:00:00', 'Scheduled', '2025-05-21 04:58:16'),
(15, 2, 2, '2024-03-21 10:30:00', 'Scheduled', '2025-05-21 04:58:16'),
(16, 3, 3, '2024-03-22 14:00:00', 'Scheduled', '2025-05-21 04:58:16'),
(17, 1, 1, '2024-03-20 09:00:00', 'Scheduled', '2025-05-21 04:59:17'),
(18, 2, 2, '2024-03-21 10:30:00', 'Scheduled', '2025-05-21 04:59:17'),
(19, 3, 3, '2024-03-22 14:00:00', 'Scheduled', '2025-05-21 04:59:17'),
(20, 1, 1, '2024-03-20 09:00:00', 'Scheduled', '2025-05-21 04:59:54'),
(21, 2, 2, '2024-03-21 10:30:00', 'Scheduled', '2025-05-21 04:59:54'),
(22, 3, 3, '2024-03-22 14:00:00', 'Scheduled', '2025-05-21 04:59:54');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` int(11) NOT NULL,
  `vaccine_id` int(11) DEFAULT NULL,
  `batch_number` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `vaccine_id`, `batch_number`, `quantity`, `expiry_date`, `last_updated`) VALUES
(1, 1, 'PFZ2024001', 100, '2024-12-31', '2025-05-21 04:22:59'),
(2, 2, 'MOD2024001', 150, '2024-12-31', '2025-05-21 04:22:59'),
(3, 3, 'FLU2024001', 200, '2024-12-31', '2025-05-21 04:22:59'),
(4, 1, 'PFZ2024001', 100, '2024-12-31', '2025-05-21 04:42:37'),
(5, 2, 'MOD2024001', 150, '2024-12-31', '2025-05-21 04:42:37'),
(6, 3, 'FLU2024001', 200, '2024-12-31', '2025-05-21 04:42:37'),
(7, 1, 'PFZ2024001', 100, '2024-12-31', '2025-05-21 04:48:47'),
(8, 2, 'MOD2024001', 150, '2024-12-31', '2025-05-21 04:48:47'),
(9, 3, 'FLU2024001', 200, '2024-12-31', '2025-05-21 04:48:47'),
(10, 1, 'PFZ2024001', 100, '2024-12-31', '2025-05-21 04:57:31'),
(11, 2, 'MOD2024001', 150, '2024-12-31', '2025-05-21 04:57:31'),
(12, 3, 'FLU2024001', 200, '2024-12-31', '2025-05-21 04:57:31'),
(13, 1, 'PFZ2024001', 100, '2024-12-31', '2025-05-21 04:58:16'),
(14, 2, 'MOD2024001', 150, '2024-12-31', '2025-05-21 04:58:16'),
(15, 3, 'FLU2024001', 200, '2024-12-31', '2025-05-21 04:58:16'),
(16, 1, 'PFZ2024001', 100, '2024-12-31', '2025-05-21 04:59:17'),
(17, 2, 'MOD2024001', 150, '2024-12-31', '2025-05-21 04:59:17'),
(18, 3, 'FLU2024001', 200, '2024-12-31', '2025-05-21 04:59:17'),
(19, 1, 'PFZ2024001', 100, '2024-12-31', '2025-05-21 04:59:54'),
(20, 2, 'MOD2024001', 150, '2024-12-31', '2025-05-21 04:59:54'),
(21, 3, 'FLU2024001', 200, '2024-12-31', '2025-05-21 04:59:54');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `patient_id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`patient_id`, `full_name`, `birth_date`, `gender`, `address`, `contact_number`, `email`, `registration_date`) VALUES
(1, 'John Doe', '1990-05-15', 'Male', '123 Main St, City', '09123456789', 'john.doe@email.com', '2025-05-21 04:22:59'),
(2, 'Jane Smith', '1988-08-22', 'Female', '456 Oak Ave, Town', '09234567890', 'jane.smith@email.com', '2025-05-21 04:22:59'),
(3, 'Mike Johnson', '1995-03-10', 'Male', '789 Pine Rd, Village', '09345678901', 'mike.johnson@email.com', '2025-05-21 04:22:59'),
(4, 'John Doe', '1990-05-15', 'Male', '123 Main St, City', '09123456789', 'john.doe@email.com', '2025-05-21 04:42:37'),
(5, 'Jane Smith', '1988-08-22', 'Female', '456 Oak Ave, Town', '09234567890', 'jane.smith@email.com', '2025-05-21 04:42:37'),
(6, 'Mike Johnson', '1995-03-10', 'Male', '789 Pine Rd, Village', '09345678901', 'mike.johnson@email.com', '2025-05-21 04:42:37'),
(7, 'John Doe', '1990-05-15', 'Male', '123 Main St, City', '09123456789', 'john.doe@email.com', '2025-05-21 04:48:47'),
(8, 'Jane Smith', '1988-08-22', 'Female', '456 Oak Ave, Town', '09234567890', 'jane.smith@email.com', '2025-05-21 04:48:47'),
(11, 'John Doe', '1990-05-15', 'Male', '123 Main St, City', '09123456789', 'john.doe@email.com', '2025-05-21 04:57:31'),
(12, 'Jane Smith', '1988-08-22', 'Female', '456 Oak Ave, Town', '09234567890', 'jane.smith@email.com', '2025-05-21 04:57:31'),
(13, 'Mike Johnson', '1995-03-10', 'Male', '789 Pine Rd, Village', '09345678901', 'mike.johnson@email.com', '2025-05-21 04:57:31'),
(14, 'John Doe', '1990-05-15', 'Male', '123 Main St, City', '09123456789', 'john.doe@email.com', '2025-05-21 04:58:16'),
(15, 'Jane Smith', '1988-08-22', 'Female', '456 Oak Ave, Town', '09234567890', 'jane.smith@email.com', '2025-05-21 04:58:16'),
(16, 'Mike Johnson', '1995-03-10', 'Male', '789 Pine Rd, Village', '09345678901', 'mike.johnson@email.com', '2025-05-21 04:58:16');

-- --------------------------------------------------------

--
-- Table structure for table `queue`
--

CREATE TABLE `queue` (
  `queue_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `queue_number` int(11) DEFAULT NULL,
  `priority_level` enum('Normal','Emergency') DEFAULT 'Normal',
  `check_in_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Waiting','In Progress','Completed') DEFAULT 'Waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `queue`
--

INSERT INTO `queue` (`queue_id`, `patient_id`, `queue_number`, `priority_level`, `check_in_time`, `status`) VALUES
(1, 1, 1, 'Normal', '2025-05-21 04:22:59', 'Waiting'),
(2, 2, 2, 'Emergency', '2025-05-21 04:22:59', 'Waiting'),
(3, 1, 1, 'Normal', '2025-05-21 04:42:37', 'Waiting'),
(4, 2, 2, 'Emergency', '2025-05-21 04:42:37', 'Waiting'),
(5, 1, 1, 'Normal', '2025-05-21 04:48:47', 'Waiting'),
(6, 2, 2, 'Emergency', '2025-05-21 04:48:47', 'Waiting'),
(7, 1, 1, 'Normal', '2025-05-21 04:57:31', 'Waiting'),
(8, 2, 2, 'Emergency', '2025-05-21 04:57:31', 'Waiting'),
(9, 1, 1, 'Normal', '2025-05-21 04:58:16', 'Waiting'),
(10, 2, 2, 'Emergency', '2025-05-21 04:58:16', 'Waiting'),
(11, 1, 1, 'Normal', '2025-05-21 04:59:17', 'Waiting'),
(12, 2, 2, 'Emergency', '2025-05-21 04:59:17', 'Waiting'),
(13, 1, 1, 'Normal', '2025-05-21 04:59:54', 'Waiting'),
(14, 2, 2, 'Emergency', '2025-05-21 04:59:54', 'Waiting');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password_hash` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `full_name`, `role`, `username`, `password_hash`) VALUES
(1, 'Dr. Sarah Wilson', 'Doctor', 'dr.wilson', '$2a$10$GPbJcTnpd1mKX9ITDvE0.eMUOJlpZ2gpi17vM3IYm2cjqcw7ulGgK'),
(2, 'Nurse Emma Brown', 'Nurse', 'nurse.brown', '$2a$10$mtRC7maPUHwK5IeFVjyBze6rFjatYjzk/aRsrWiFLkhL.7Dp/C45W'),
(3, 'Dr. Sarah Wilson', 'Doctor', 'dr.wilson', '$2a$10$kdAkTFkxI/WcViXZwlFrTuSZOLiRRy/BwsBZ7vmhoQmxH5QZajgOK'),
(4, 'Nurse Emma Brown', 'Nurse', 'nurse.brown', '$2a$10$EwJf8iYCu3MoUHzZUsTPC.Njk0qBhAJza6ULuSYHv1W5k75ggVzJy'),
(5, 'Dr. Sarah Wilson', 'Doctor', 'dr.wilson', '$2a$10$nNBsLRJdzsCSvstYxdkUA..SkkwC/LTDWMhZ56cSa27CDk2dtX77K'),
(6, 'Nurse Emma Brown', 'Nurse', 'nurse.brown', '$2a$10$oI1uT0sOkBXBqNOvdi6fhuzF5adXIGCEELMHzdyqIKD5ZpBll1z56'),
(7, 'Dr. Sarah Wilson', 'Doctor', 'dr.wilson', '$2a$10$jLWAaxDEsKwO61SXl1223.1S9MXz3M.Qdf9i7sxSdX6eoh0SUMaC6'),
(8, 'Nurse Emma Brown', 'Nurse', 'nurse.brown', '$2a$10$D07ri4shukr8kKOPR7D74O43.rSrNAGd4rKhi/9s3yXZkAk8UUxRC'),
(9, 'Dr. Sarah Wilson', 'Doctor', 'dr.wilson', '$2a$10$wwKwwAtjX2PUpASddVJulurBhkVGC1GkJuXjeaq14YZaKnAijMgym'),
(10, 'Nurse Emma Brown', 'Nurse', 'nurse.brown', '$2a$10$o9aofbMeZTbpR6O/6uAIguBpyFQB49US/PKG3b7uNkTzDySeVQpU.'),
(11, 'Dr. Sarah Wilson', 'Doctor', 'dr.wilson', '$2a$10$pyDsuPwy2qj.XXziHRrkgOk0.VD1J.1wFtCFP35JS5p3M8oJFARfC'),
(12, 'Nurse Emma Brown', 'Nurse', 'nurse.brown', '$2a$10$.EjyJU2eurdXf1lziwHi5ef1o.FOGp/BhBiObs3BWsfNjGBk0/QaW'),
(13, 'Dr. Sarah Wilson', 'Doctor', 'dr.wilson', '$2a$10$aigex7BHFq.G1oWiOnTG0udbrbjkfx8CPWccCl/ImGmUXougszLEi'),
(14, 'Nurse Emma Brown', 'Nurse', 'nurse.brown', '$2a$10$fpz7IwsJUqhcEnj2GXcc7Op/6dXsVnZn3YWgtgVuCwO.KUKxI3cei');

-- --------------------------------------------------------

--
-- Table structure for table `vaccines`
--

CREATE TABLE `vaccines` (
  `vaccine_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `manufacturer` varchar(100) DEFAULT NULL,
  `dosage_required` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vaccines`
--

INSERT INTO `vaccines` (`vaccine_id`, `name`, `manufacturer`, `dosage_required`, `description`) VALUES
(1, 'COVID-19 Pfizer', 'Pfizer-BioNTech', 2, 'mRNA vaccine for COVID-19'),
(2, 'COVID-19 Moderna', 'Moderna', 2, 'mRNA vaccine for COVID-19'),
(3, 'Influenza', 'Sanofi', 1, 'Annual flu vaccine'),
(4, 'COVID-19 Pfizer', 'Pfizer-BioNTech', 2, 'mRNA vaccine for COVID-19'),
(5, 'COVID-19 Moderna', 'Moderna', 2, 'mRNA vaccine for COVID-19'),
(6, 'Influenza', 'Sanofi', 1, 'Annual flu vaccine'),
(12, 'COVID-19 Pfizer', 'Pfizer-BioNTech', 2, 'mRNA vaccine for COVID-19'),
(13, 'COVID-19 Moderna', 'Moderna', 2, 'mRNA vaccine for COVID-19'),
(14, 'Influenza', 'Sanofi', 1, 'Annual flu vaccine'),
(15, 'COVID-19 Pfizer', 'Pfizer-BioNTech', 2, 'mRNA vaccine for COVID-19'),
(16, 'COVID-19 Moderna', 'Moderna', 2, 'mRNA vaccine for COVID-19'),
(17, 'Influenza', 'Sanofi', 1, 'Annual flu vaccine'),
(18, 'COVID-19 Pfizer', 'Pfizer-BioNTech', 2, 'mRNA vaccine for COVID-19'),
(19, 'COVID-19 Moderna', 'Moderna', 2, 'mRNA vaccine for COVID-19'),
(20, 'Influenza', 'Sanofi', 1, 'Annual flu vaccine'),
(21, 'COVID-19 Pfizer', 'Pfizer-BioNTech', 2, 'mRNA vaccine for COVID-19'),
(22, 'COVID-19 Moderna', 'Moderna', 2, 'mRNA vaccine for COVID-19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `vaccine_id` (`vaccine_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD KEY `vaccine_id` (`vaccine_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`patient_id`);

--
-- Indexes for table `queue`
--
ALTER TABLE `queue`
  ADD PRIMARY KEY (`queue_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`);

--
-- Indexes for table `vaccines`
--
ALTER TABLE `vaccines`
  ADD PRIMARY KEY (`vaccine_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `patient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `queue`
--
ALTER TABLE `queue`
  MODIFY `queue_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `vaccines`
--
ALTER TABLE `vaccines`
  MODIFY `vaccine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`vaccine_id`) REFERENCES `vaccines` (`vaccine_id`);

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`vaccine_id`) REFERENCES `vaccines` (`vaccine_id`);

--
-- Constraints for table `queue`
--
ALTER TABLE `queue`
  ADD CONSTRAINT `queue_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
