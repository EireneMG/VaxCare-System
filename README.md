# VaxCare System

A vaccination management system built with Node.js and MySQL using XAMPP.

## Prerequisites

- Node.js (v14 or higher)
- XAMPP (for MySQL database)
- npm (Node Package Manager)

## Features

### Patient Management
- Add, view, and manage patient records
- Store patient information including:
  - Full name
  - Birth date
  - Gender
  - Contact number
  - Address
  - Registration date

### Vaccine Management
- Track vaccine inventory
- Monitor vaccine stock levels
- Record vaccine details:
  - Vaccine name
  - Manufacturer
  - Stock quantity
  - Expiry date

### Queue Management
- Add patients to vaccination queue
- Set priority levels (Normal/Emergency)
- Track queue status (Waiting/In Progress/Completed)
- Real-time queue updates

### Vaccination Records
- Record administered vaccinations
- Track dose numbers
- Add remarks for each vaccination
- Record administering staff
- Track modification history

### User Management
- User authentication system
- Role-based access (Admin/Worker)
- Activity logging
- Secure password handling

## Technical Stack

- **Frontend**: HTML, CSS (Bootstrap 5), JavaScript
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Authentication**: Custom token-based authentication

## Database Schema

The system uses the following main tables:
- `users` - User accounts and authentication
- `patients` - Patient information
- `vaccines` - Vaccine inventory
- `vaccination_records` - Vaccination history
- `queue` - Patient queue management
- `activity_logs` - System activity tracking

## Setup Instructions

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm install
   ```

3. Start XAMPP:
   - Open XAMPP Control Panel
   - Start Apache and MySQL services
   - Click on "Admin" button next to MySQL to open phpMyAdmin

4. Create the database:
   - In phpMyAdmin, click "New" to create a new database
   - Name it `vaxcare_db`
   - Click "Create"

5. Import the database schema:
   - In phpMyAdmin, select the `vaxcare_db` database
   - Go to the "Import" tab
   - Import vaxcare_db.sql

6. Configure the database connection:
   - The default XAMPP configuration is already set in the code:
     - Host: localhost
     - User: root
     - Password: (empty)
     - Port: 3306
     - Database: vaxcare_db

7. Start the server:
   ```bash
   node server.js
   ```

**Access the application**
   - Open your web browser
   - Navigate to `http://localhost:3000`
