# VaxCare System

A vaccination management system built with Node.js and MySQL using XAMPP.

## Prerequisites

- Node.js (v14 or higher)
- XAMPP (for MySQL database)
- npm (Node Package Manager)

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

7. Insert dummy data:
   ```bash
   node dummyData.js
   ```

8. Start the server:
   ```bash
   node server.js
   ```

**Access the application**
   - Open your web browser
   - Navigate to `http://localhost:3000`
