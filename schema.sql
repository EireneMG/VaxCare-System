-- Create database if not exists
CREATE DATABASE IF NOT EXISTS vaxcare_db;
USE vaxcare_db;

-- Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'worker') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccines Table
CREATE TABLE vaccines (
    vaccine_id INT PRIMARY KEY AUTO_INCREMENT,
    vaccine_name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    expiry_date DATE NOT NULL
);

-- Vaccination Records Table
CREATE TABLE vaccination_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    administered_by INT NOT NULL,
    dose_number INT NOT NULL,
    date_administered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(vaccine_id),
    FOREIGN KEY (administered_by) REFERENCES users(user_id)
);

-- Vaccination Record History Table
CREATE TABLE vaccination_record_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    record_id INT NOT NULL,
    modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_dose_number INT,
    new_dose_number INT,
    old_remarks TEXT,
    new_remarks TEXT,
    FOREIGN KEY (record_id) REFERENCES vaccination_records(record_id),
    FOREIGN KEY (modified_by) REFERENCES users(user_id)
);

-- Queue Table
CREATE TABLE queue (
    queue_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    status ENUM('Waiting', 'In Progress', 'Completed') NOT NULL DEFAULT 'Waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Activity Logs Table
CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
); 