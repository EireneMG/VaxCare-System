const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vaxcare_db',
  port: 3306
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Helper function for database queries
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const [user] = await query('SELECT * FROM users WHERE user_id = ?', [token]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      user_id: user.user_id,
      full_name: user.full_name,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register route
app.post('/api/register', async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const result = await query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name, email, hashedPassword, role]
    );
    
    res.json({ 
      user_id: result.insertId,
      message: 'User registered successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Patients Routes
app.get('/api/patients', authenticateUser, async (req, res) => {
  try {
    const patients = await query('SELECT * FROM patients');
    // Format birth dates to remove time component
    const formattedPatients = patients.map(patient => ({
      ...patient,
      birth_date: patient.birth_date.toISOString().split('T')[0]
    }));
    res.json(formattedPatients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/patients', authenticateUser, async (req, res) => {
  try {
    const { full_name, birth_date, gender, contact_number, address } = req.body;
    const registration_date = new Date().toISOString();
    
    // Ensure birth_date is in YYYY-MM-DD format
    const formattedBirthDate = birth_date.split('T')[0];
    
    const result = await query(
      'INSERT INTO patients (full_name, birth_date, gender, contact_number, address, registration_date) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, formattedBirthDate, gender, contact_number, address, registration_date]
    );
    
    // Log activity
    await query(
      'INSERT INTO activity_logs (user_id, action) VALUES (?, ?)',
      [req.user.user_id, `Added new patient: ${full_name}`]
    );
    
    res.json({ id: result.insertId, message: 'Patient added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/patients/:id', authenticateUser, async (req, res) => {
  try {
    const { full_name, birth_date, gender, contact_number, address } = req.body;
    
    // Ensure birth_date is in YYYY-MM-DD format
    const formattedBirthDate = birth_date.split('T')[0];
    
    await query(
      'UPDATE patients SET full_name = ?, birth_date = ?, gender = ?, contact_number = ?, address = ? WHERE patient_id = ?',
      [full_name, formattedBirthDate, gender, contact_number, address, req.params.id]
    );
    
    // Log activity
    await query(
      'INSERT INTO activity_logs (user_id, action) VALUES (?, ?)',
      [req.user.user_id, `Updated patient ID: ${req.params.id}`]
    );
    
    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    await query('DELETE FROM patients WHERE patient_id = ?', [req.params.id]);
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single patient
app.get('/api/patients/:id', async (req, res) => {
  try {
    const [patient] = await query('SELECT * FROM patients WHERE patient_id = ?', [req.params.id]);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vaccines Routes
app.get('/api/vaccines', authenticateUser, async (req, res) => {
  try {
    const vaccines = await query('SELECT * FROM vaccines');
    res.json(vaccines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vaccines', authenticateUser, async (req, res) => {
  try {
    const { vaccine_name, manufacturer, stock_quantity, expiry_date } = req.body;
    
    const result = await query(
      'INSERT INTO vaccines (vaccine_name, manufacturer, stock_quantity, expiry_date) VALUES (?, ?, ?, ?)',
      [vaccine_name, manufacturer, stock_quantity, expiry_date]
    );
    
    // Log activity
    await query(
      'INSERT INTO activity_logs (user_id, action) VALUES (?, ?)',
      [req.user.user_id, `Added new vaccine: ${vaccine_name}`]
    );
    
    res.json({ id: result.insertId, message: 'Vaccine added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/vaccines/:id', async (req, res) => {
  try {
    const { name, manufacturer, dosage_required, description } = req.body;
    await query(
      'UPDATE vaccines SET name = ?, manufacturer = ?, dosage_required = ?, description = ? WHERE vaccine_id = ?',
      [name, manufacturer, dosage_required, description, req.params.id]
    );
    res.json({ message: 'Vaccine updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/vaccines/:id', async (req, res) => {
  try {
    await query('DELETE FROM vaccines WHERE vaccine_id = ?', [req.params.id]);
    res.json({ message: 'Vaccine deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single vaccine
app.get('/api/vaccines/:id', async (req, res) => {
  try {
    const [vaccine] = await query('SELECT * FROM vaccines WHERE vaccine_id = ?', [req.params.id]);
    if (!vaccine) {
      return res.status(404).json({ error: 'Vaccine not found' });
    }
    res.json(vaccine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vaccination Records Routes
app.get('/api/vaccination-records', authenticateUser, async (req, res) => {
  try {
    const records = await query(`
      SELECT vr.*, p.full_name as patient_name, v.vaccine_name, u.full_name as administered_by_name
      FROM vaccination_records vr
      JOIN patients p ON vr.patient_id = p.patient_id
      JOIN vaccines v ON vr.vaccine_id = v.vaccine_id
      JOIN users u ON vr.administered_by = u.user_id
    `);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add vaccination record
app.post('/api/vaccination-records', authenticateUser, async (req, res) => {
  try {
    const { patient_id, vaccine_id, dose_number, remarks } = req.body;
    
    // Start transaction
    await query('START TRANSACTION');
    
    try {
      // Insert vaccination record
      const result = await query(
        'INSERT INTO vaccination_records (patient_id, vaccine_id, administered_by, dose_number, remarks) VALUES (?, ?, ?, ?, ?)',
        [patient_id, vaccine_id, req.user.user_id, dose_number, remarks]
      );
      
      // Decrement vaccine stock
      await query(
        'UPDATE vaccines SET stock_quantity = stock_quantity - ? WHERE vaccine_id = ?',
        [dose_number, vaccine_id]
      );
      
      // Log activity
      await query(
        'INSERT INTO activity_logs (user_id, action) VALUES (?, ?)',
        [req.user.user_id, `Added vaccination record for patient ID: ${patient_id} and vaccine ID: ${vaccine_id}`]
      );
      
      await query('COMMIT');
      res.json({ 
        id: result.insertId,
        message: 'Vaccination record added successfully' 
      });
    } catch (err) {
      await query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Queue Routes
app.get('/api/queue', authenticateUser, async (req, res) => {
  try {
    const queue = await query(`
      SELECT q.*, p.full_name as patient_name 
      FROM queue q 
      JOIN patients p ON q.patient_id = p.patient_id
      WHERE q.status != 'Completed'
      ORDER BY FIELD(q.priority, 'Emergency', 'Normal'), q.created_at ASC
    `);
    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/queue', authenticateUser, async (req, res) => {
  try {
    const { patient_id } = req.body;
    const priority = req.body.priority || 'Normal'; // Default to Normal if not provided
    
    // Check if patient is already in queue
    const [existingQueue] = await query(
      'SELECT * FROM queue WHERE patient_id = ? AND status != "Completed"',
      [patient_id]
    );
    
    if (existingQueue) {
      return res.status(400).json({ error: 'Patient is already in queue' });
    }
    
    const created_at = new Date().toISOString();
    const result = await query(
      'INSERT INTO queue (patient_id, priority, status, created_at) VALUES (?, ?, "Waiting", ?)',
      [patient_id, priority, created_at]
    );
    
    // Log activity
    await query(
      'INSERT INTO activity_logs (user_id, action) VALUES (?, ?)',
      [req.user.user_id, `Added patient ID: ${patient_id} with priority ${priority} to queue`]
    );
    
    res.json({ 
      id: result.insertId,
      message: 'Added to queue successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/queue/:id', authenticateUser, async (req, res) => {
  try {
    const { status } = req.body;
    const priority = req.body.priority; // Allow updating priority
    
    let sql = 'UPDATE queue SET status = ?';
    const params = [status];
    
    if (priority) {
      sql += ', priority = ?';
      params.push(priority);
    }
    
    sql += ' WHERE queue_id = ?';
    params.push(req.params.id);

    await query(sql, params);
    
    // Log activity
    await query(
      'INSERT INTO activity_logs (user_id, action) VALUES (?, ?)',
      [req.user.user_id, `Updated queue ID: ${req.params.id} status to ${status}${priority ? ' and priority to ' + priority : ''}`]
    );
    
    res.json({ message: 'Queue updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activity Logs Route
app.get('/api/activity-logs', authenticateUser, async (req, res) => {
  try {
    const logs = await query(`
      SELECT al.*, u.full_name as user_name
      FROM activity_logs al
      JOIN users u ON al.user_id = u.user_id
      ORDER BY al.timestamp DESC
    `);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
