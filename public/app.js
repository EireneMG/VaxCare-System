// API endpoints
const API_URL = '/api';

// Global variables for sorting
let currentSort = {
    column: null,
    direction: 'asc'
};

// Global variables
let currentUser = null;
let patients = [];
let vaccines = [];
let queue = [];
let vaccinationRecords = [];
let activityLogs = [];

// Search functionality
function setupSearch(tableId, searchId) {
    const searchInput = document.getElementById(searchId);
    const table = document.getElementById(tableId);
    
    if (!searchInput || !table) {
        console.warn(`Search setup skipped: ${searchId} or ${tableId} not found`);
        return;
    }
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Sorting functionality
function setupSorting(tableId) {
    const table = document.getElementById(tableId);
    const headers = table.querySelectorAll('th[data-sort]');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            const direction = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';
            
            // Update sort indicators
            headers.forEach(h => h.querySelector('i').className = 'bi bi-arrow-down-up');
            header.querySelector('i').className = `bi bi-arrow-${direction === 'asc' ? 'up' : 'down'}`;
            
            // Update current sort
            currentSort = { column, direction };
            
            // Sort the table
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.sort((a, b) => {
                const aValue = a.querySelector(`td:nth-child(${Array.from(header.parentNode.children).indexOf(header) + 1})`).textContent;
                const bValue = b.querySelector(`td:nth-child(${Array.from(header.parentNode.children).indexOf(header) + 1})`).textContent;
                
                if (direction === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            });
            
            tbody.innerHTML = '';
            rows.forEach(row => tbody.appendChild(row));
        });
    });
}

// Authentication functions
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Login response:', data);
        
        if (response.ok && data.user_id) {
            currentUser = {
                user_id: data.user_id,
                full_name: data.full_name,
                role: data.role
            };
            
            localStorage.setItem('user', JSON.stringify(currentUser));
            showMainContent();
            await loadAllData();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

async function register(fullName, email, password, role) {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName, email, password, role })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            showLoginForm();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    showLoginForm();
}

// Helper function for authenticated requests
async function authenticatedFetch(url, options = {}) {
    if (!currentUser || !currentUser.user_id) {
        console.error('No user found');
        showLoginForm();
        throw new Error('Not authenticated');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': currentUser.user_id.toString(),
        ...options.headers
    };
    
    try {
        const response = await fetch(url, { ...options, headers });
        
        if (response.status === 401) {
            console.error('Authentication failed:', response.status);
            localStorage.removeItem('user');
            currentUser = null;
            showLoginForm();
            throw new Error('Session expired. Please login again.');
        }
        
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Load all data
async function loadAllData() {
    try {
        console.log('Loading all data...'); // Debug log
        await Promise.all([
            loadPatients(),
            loadVaccines(),
            loadQueue(),
            loadVaccinationRecords(),
            loadActivityLogs()
        ]);
        console.log('All data loaded successfully'); // Debug log
    } catch (error) {
        console.error('Error loading data:', error);
        if (error.message.includes('Session expired')) {
            showLoginForm();
        } else {
            alert('Error loading data. Please try again.');
        }
    }
}

// Patients functions
async function loadPatients() {
    try {
        console.log('Loading patients...'); // Debug log
        const response = await authenticatedFetch(`${API_URL}/patients`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        patients = await response.json();
        updatePatientsTable();
        console.log('Patients loaded:', patients); // Debug log
    } catch (error) {
        console.error('Error loading patients:', error);
        throw error;
    }
}

async function addPatient() {
    const form = document.getElementById('addPatientForm');
    const data = {
        full_name: document.getElementById('patientName').value,
        birth_date: document.getElementById('patientBirthDate').value,
        gender: document.getElementById('patientGender').value,
        contact_number: document.getElementById('patientContact').value,
        address: document.getElementById('patientAddress').value,
        registration_date: new Date().toISOString()
    };
    
    try {
        console.log('Adding patient:', data); // Debug log
        const response = await authenticatedFetch(`${API_URL}/patients`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPatientModal'));
            modal.hide();
            form.reset();
            await loadPatients();
            await populateSelectOptions();
            alert('Patient added successfully');
        } else {
            const error = await response.json();
            alert('Error adding patient: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error adding patient:', error);
        alert('Error adding patient: ' + error.message);
    }
}

// Vaccines functions
async function loadVaccines() {
    try {
        console.log('Loading vaccines...'); // Debug log
        const response = await authenticatedFetch(`${API_URL}/vaccines`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        vaccines = await response.json();
        updateVaccinesTable();
        console.log('Vaccines loaded:', vaccines); // Debug log
    } catch (error) {
        console.error('Error loading vaccines:', error);
        throw error;
    }
}

async function addVaccine() {
    const form = document.getElementById('addVaccineForm');
    const formData = new FormData(form);
    const data = {
        vaccine_name: document.getElementById('vaccineName').value,
        manufacturer: document.getElementById('vaccineManufacturer').value,
        stock_quantity: parseInt(document.getElementById('vaccineStock').value),
        expiry_date: document.getElementById('vaccineExpiry').value
    };
    
    try {
        console.log('Adding vaccine:', data); // Debug log
        const response = await authenticatedFetch(`${API_URL}/vaccines`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addVaccineModal'));
            modal.hide();
            form.reset();
            await loadVaccines();
            await populateSelectOptions();
            alert('Vaccine added successfully');
        } else {
            const error = await response.json();
            alert('Error adding vaccine: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error adding vaccine:', error);
        alert('Error adding vaccine: ' + error.message);
    }
}

// Queue functions
async function loadQueue() {
    try {
        console.log('Loading queue...'); // Debug log
        const response = await authenticatedFetch(`${API_URL}/queue`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        queue = await response.json();
        updateQueueTable();
        console.log('Queue loaded:', queue); // Debug log
    } catch (error) {
        console.error('Error loading queue:', error);
        throw error;
    }
}

async function addToQueue() {
    const form = document.getElementById('addToQueueForm');
    const data = {
        patient_id: document.getElementById('queuePatient').value
    };
    
    try {
        console.log('Adding to queue:', data); // Debug log
        const response = await authenticatedFetch(`${API_URL}/queue`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addToQueueModal'));
            modal.hide();
            form.reset();
            await loadQueue();
            await populateSelectOptions();
            alert('Added to queue successfully');
        } else {
            const error = await response.json();
            alert('Error adding to queue: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error adding to queue:', error);
        alert('Error adding to queue: ' + error.message);
    }
}

// Vaccination Records functions
async function loadVaccinationRecords() {
    try {
        console.log('Loading vaccination records...'); // Debug log
        const response = await authenticatedFetch(`${API_URL}/vaccination-records`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        vaccinationRecords = await response.json();
        updateVaccinationRecordsTable();
        console.log('Vaccination records loaded:', vaccinationRecords); // Debug log
    } catch (error) {
        console.error('Error loading vaccination records:', error);
        throw error;
    }
}

async function addVaccinationRecord() {
    const form = document.getElementById('addVaccinationRecordForm');
    const data = {
        patient_id: document.getElementById('recordPatient').value,
        vaccine_id: document.getElementById('recordVaccine').value,
        dose_number: parseInt(document.getElementById('recordDose').value),
        remarks: document.getElementById('recordRemarks').value,
        date_administered: new Date().toISOString()
    };
    
    try {
        console.log('Adding vaccination record:', data); // Debug log
        const response = await authenticatedFetch(`${API_URL}/vaccination-records`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addVaccinationRecordModal'));
            modal.hide();
            form.reset();
            await loadVaccinationRecords();
            await loadVaccines(); // Reload vaccines to update stock
            await populateSelectOptions();
            alert('Vaccination record added successfully');
        } else {
            const error = await response.json();
            alert('Error adding vaccination record: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error adding vaccination record:', error);
        alert('Error adding vaccination record: ' + error.message);
    }
}

// Activity Logs functions
async function loadActivityLogs() {
    try {
        console.log('Loading activity logs...'); // Debug log
        const response = await authenticatedFetch(`${API_URL}/activity-logs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        activityLogs = await response.json();
        updateActivityLogsTable();
        console.log('Activity logs loaded:', activityLogs); // Debug log
    } catch (error) {
        console.error('Error loading activity logs:', error);
        throw error;
    }
}

// UI Update functions
function formatDate(dateString) {
    if (!dateString) return '';
    
    // Parse the date string
    const date = new Date(dateString);
    
    // Check if this is a birth date (no time component)
    const isBirthDate = dateString.split('T').length === 1 || dateString.includes('00:00:00');
    
    if (isBirthDate) {
        // Format birth date without time
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        // Format other dates with time
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Manila'
        };
        
        // Add timezone offset to ensure correct time
        const philippineDate = new Date(date.getTime() + (8 * 60 * 60 * 1000)); // Add 8 hours for Philippine time
        return philippineDate.toLocaleString('en-US', options);
    }
}

// Add this function to format dates for input fields
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function updatePatientsTable() {
    const tbody = document.querySelector('#patientsTable tbody');
    tbody.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.full_name}</td>
            <td>${formatDate(patient.birth_date)}</td>
            <td>${patient.gender}</td>
            <td>${patient.contact_number}</td>
            <td>${patient.address}</td>
            <td>${formatDate(patient.registration_date)}</td>
        </tr>
    `).join('');
}

function updateVaccinesTable() {
    const tbody = document.querySelector('#vaccinesTable tbody');
    tbody.innerHTML = vaccines.map(vaccine => `
        <tr>
            <td>${vaccine.vaccine_name}</td>
            <td>${vaccine.manufacturer}</td>
            <td>${vaccine.stock_quantity}</td>
            <td>${formatDate(vaccine.expiry_date)}</td>
        </tr>
    `).join('');
}

function updateQueueTable() {
    const tbody = document.querySelector('#queueTable tbody');
    tbody.innerHTML = queue.map(item => `
        <tr>
            <td>${item.patient_name}</td>
            <td>${item.status}</td>
            <td>${formatDate(item.created_at)}</td>
            <td>
                <button onclick="updateQueueStatus(${item.queue_id}, 'In Progress')" 
                        ${item.status === 'In Progress' ? 'disabled' : ''}>
                    Start
                </button>
                <button onclick="updateQueueStatus(${item.queue_id}, 'Completed')"
                        ${item.status === 'Completed' ? 'disabled' : ''}>
                    Complete
                </button>
            </td>
        </tr>
    `).join('');
}

function updateVaccinationRecordsTable() {
    const tbody = document.querySelector('#vaccinationRecordsTable tbody');
    tbody.innerHTML = vaccinationRecords.map(record => `
        <tr>
            <td>${record.patient_name}</td>
            <td>${record.vaccine_name}</td>
            <td>${record.dose_number}</td>
            <td>${formatDate(record.date_administered)}</td>
            <td>${record.remarks || ''}</td>
            <td>${record.administered_by_name}</td>
            <td>${formatDate(record.last_modified)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editVaccinationRecord(${record.record_id})">Edit</button>
                <button class="btn btn-sm btn-info" onclick="viewRecordHistory(${record.record_id})">History</button>
            </td>
        </tr>
    `).join('');
}

function updateActivityLogsTable() {
    const tbody = document.querySelector('#activityLogsTable tbody');
    tbody.innerHTML = activityLogs.map(log => `
        <tr>
            <td>${log.user_name}</td>
            <td>${log.action}</td>
            <td>${formatDate(log.timestamp)}</td>
        </tr>
    `).join('');
}

// Form handling functions
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
}

function handleRegister(event) {
    event.preventDefault();
    const fullName = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    register(fullName, email, password, role);
}

function handleAddPatient(event) {
    event.preventDefault();
    addPatient();
}

function handleAddVaccine(event) {
    event.preventDefault();
    const vaccineData = {
        vaccine_name: document.getElementById('vaccineName').value,
        manufacturer: document.getElementById('vaccineManufacturer').value,
        stock_quantity: parseInt(document.getElementById('vaccineStock').value),
        expiry_date: document.getElementById('vaccineExpiry').value
    };
    addVaccine(vaccineData);
}

function handleAddVaccinationRecord(event) {
    event.preventDefault();
    const recordData = {
        patient_id: document.getElementById('recordPatient').value,
        vaccine_id: document.getElementById('recordVaccine').value,
        dose_number: parseInt(document.getElementById('recordDose').value),
        remarks: document.getElementById('recordRemarks').value
    };
    addVaccinationRecord(recordData);
}

// UI State functions
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
}

function showMainContent() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    // Show patients section by default
    showSection('patients');
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.user_id) {
                currentUser = parsedUser;
                showMainContent();
                loadAllData();
            } else {
                console.error('Invalid stored user data');
                localStorage.removeItem('user');
                showLoginForm();
            }
        } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('user');
            showLoginForm();
        }
    } else {
        showLoginForm();
    }

    // Add event listeners
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    });

    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('addPatientForm').addEventListener('submit', handleAddPatient);
    document.getElementById('addVaccineForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addVaccine();
    });
    document.getElementById('addVaccinationRecordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addVaccinationRecord();
    });
    document.getElementById('addToQueueForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addToQueue();
    });
    
    // Add navigation event listeners
    document.getElementById('showRegister').addEventListener('click', showRegisterForm);
    document.getElementById('showLogin').addEventListener('click', showLoginForm);
    document.getElementById('logoutButton').addEventListener('click', logout);

    // Setup search functionality only for existing elements
    const searchConfigs = [
        { table: 'patientsTable', search: 'patientSearch' },
        { table: 'vaccinesTable', search: 'vaccineSearch' },
        { table: 'queueTable', search: 'queueSearch' },
        { table: 'vaccinationRecordsTable', search: 'vaccinationRecordSearch' },
        { table: 'activityLogsTable', search: 'activityLogSearch' }
    ];

    searchConfigs.forEach(config => {
        if (document.getElementById(config.table) && document.getElementById(config.search)) {
            setupSearch(config.table, config.search);
        }
    });
    
    // Setup sorting functionality
    setupSorting('patientsTable');
    setupSorting('vaccinesTable');
    setupSorting('queueTable');
    setupSorting('vaccinationRecordsTable');
    setupSorting('activityLogsTable');

    // Add event listeners for modals
    const queueModal = document.getElementById('addToQueueModal');
    if (queueModal) {
        queueModal.addEventListener('show.bs.modal', () => {
            console.log('Queue modal opening, populating options...'); // Debug log
            populateSelectOptions();
        });
    }

    const vaccinationRecordModal = document.getElementById('addVaccinationRecordModal');
    if (vaccinationRecordModal) {
        vaccinationRecordModal.addEventListener('show.bs.modal', () => {
            console.log('Vaccination record modal opening, populating options...'); // Debug log
            populateSelectOptions();
        });
    }
});

// Populate select options
async function populateSelectOptions() {
    try {
        console.log('Starting to populate select options...'); // Debug log

        // Fetch patients
        const patientsResponse = await authenticatedFetch(`${API_URL}/patients`);
        if (!patientsResponse.ok) {
            throw new Error(`HTTP error! status: ${patientsResponse.status}`);
        }
        const patients = await patientsResponse.json();
        console.log('Fetched patients:', patients); // Debug log

        // Fetch vaccines
        const vaccinesResponse = await authenticatedFetch(`${API_URL}/vaccines`);
        if (!vaccinesResponse.ok) {
            throw new Error(`HTTP error! status: ${vaccinesResponse.status}`);
        }
        const vaccines = await vaccinesResponse.json();
        console.log('Fetched vaccines:', vaccines); // Debug log

        // Fetch current queue to filter out patients
        const queueResponse = await authenticatedFetch(`${API_URL}/queue`);
        if (!queueResponse.ok) {
            throw new Error(`HTTP error! status: ${queueResponse.status}`);
        }
        const queue = await queueResponse.json();
        console.log('Fetched queue:', queue); // Debug log

        // Get IDs of patients already in queue with status "Waiting" or "In Progress"
        const queuedPatientIds = queue
            .filter(item => ['Waiting', 'In Progress'].includes(item.status))
            .map(item => item.patient_id);
        console.log('Queued patient IDs:', queuedPatientIds); // Debug log

        // Filter out patients already in queue
        const availablePatients = patients.filter(patient => !queuedPatientIds.includes(patient.patient_id));
        console.log('Available patients:', availablePatients); // Debug log

        // Populate queue patient select
        const queuePatientSelect = document.getElementById('queuePatient');
        if (queuePatientSelect) {
            console.log('Found queue patient select, populating...'); // Debug log
            queuePatientSelect.innerHTML = availablePatients.map(patient => 
                `<option value="${patient.patient_id}">${patient.full_name}</option>`
            ).join('');
            console.log('Queue patient select populated with options:', queuePatientSelect.innerHTML); // Debug log
        } else {
            console.warn('Queue patient select not found'); // Debug log
        }

        // Populate vaccination record patient select
        const recordPatientSelect = document.getElementById('recordPatient');
        if (recordPatientSelect) {
            console.log('Found record patient select, populating...'); // Debug log
            recordPatientSelect.innerHTML = patients.map(patient => 
                `<option value="${patient.patient_id}">${patient.full_name}</option>`
            ).join('');
            console.log('Record patient select populated with options:', recordPatientSelect.innerHTML); // Debug log
        } else {
            console.warn('Record patient select not found'); // Debug log
        }

        // Populate vaccine select
        const recordVaccineSelect = document.getElementById('recordVaccine');
        if (recordVaccineSelect) {
            console.log('Found vaccine select, populating...'); // Debug log
            recordVaccineSelect.innerHTML = vaccines.map(vaccine => 
                `<option value="${vaccine.vaccine_id}">${vaccine.vaccine_name}</option>`
            ).join('');
            console.log('Vaccine select populated with options:', recordVaccineSelect.innerHTML); // Debug log
        } else {
            console.warn('Vaccine select not found'); // Debug log
        }
    } catch (error) {
        console.error('Error populating select options:', error);
        alert('Error loading options: ' + error.message);
    }
}

// Edit functions
async function editPatient(id) {
    try {
        const response = await authenticatedFetch(`${API_URL}/patients/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const patient = await response.json();
        
        // Populate form
        const form = document.getElementById('addPatientForm');
        form.patientName.value = patient.full_name;
        form.patientBirthDate.value = patient.birth_date;
        form.patientGender.value = patient.gender;
        form.patientAddress.value = patient.address;
        form.patientContact.value = patient.contact_number;
        
        // Change form submission to update
        form.onsubmit = (e) => {
            e.preventDefault();
            updatePatient(id);
        };
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addPatientModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching patient:', error);
        alert('Error fetching patient: ' + error.message);
    }
}

async function updatePatient(id) {
    const form = document.getElementById('addPatientForm');
    const formData = new FormData(form);
    const data = {
        full_name: formData.get('patientName'),
        birth_date: formData.get('patientBirthDate'),
        gender: formData.get('patientGender'),
        contact_number: formData.get('patientContact'),
        address: formData.get('patientAddress')
    };
    
    try {
        const response = await authenticatedFetch(`${API_URL}/patients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPatientModal'));
            modal.hide();
            form.reset();
            await loadPatients();
            await populateSelectOptions();
            alert('Patient updated successfully');
        } else {
            const error = await response.json();
            alert('Error updating patient: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating patient:', error);
        alert('Error updating patient: ' + error.message);
    }
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        try {
            const response = await authenticatedFetch(`${API_URL}/patients/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadPatients();
                await populateSelectOptions();
                alert('Patient deleted successfully');
            } else {
                const error = await response.json();
                alert('Error deleting patient: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Error deleting patient: ' + error.message);
        }
    }
}

async function editVaccine(id) {
    try {
        const response = await authenticatedFetch(`${API_URL}/vaccines/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const vaccine = await response.json();
        
        // Populate form
        const form = document.getElementById('addVaccineForm');
        form.vaccineName.value = vaccine.vaccine_name;
        form.vaccineManufacturer.value = vaccine.manufacturer;
        form.vaccineStock.value = vaccine.stock_quantity;
        form.vaccineExpiry.value = vaccine.expiry_date;
        
        // Change form submission to update
        form.onsubmit = (e) => {
            e.preventDefault();
            updateVaccine(id);
        };
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addVaccineModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching vaccine:', error);
        alert('Error fetching vaccine: ' + error.message);
    }
}

async function updateVaccine(id) {
    const form = document.getElementById('addVaccineForm');
    const formData = new FormData(form);
    const data = {
        vaccine_name: formData.get('vaccineName'),
        manufacturer: formData.get('vaccineManufacturer'),
        stock_quantity: parseInt(formData.get('vaccineStock')),
        expiry_date: formData.get('vaccineExpiry')
    };
    
    try {
        const response = await authenticatedFetch(`${API_URL}/vaccines/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addVaccineModal'));
            modal.hide();
            form.reset();
            await loadVaccines();
            await populateSelectOptions();
            alert('Vaccine updated successfully');
        } else {
            const error = await response.json();
            alert('Error updating vaccine: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating vaccine:', error);
        alert('Error updating vaccine: ' + error.message);
    }
}

async function deleteVaccine(id) {
    if (confirm('Are you sure you want to delete this vaccine?')) {
        try {
            const response = await authenticatedFetch(`${API_URL}/vaccines/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadVaccines();
                await populateSelectOptions();
                alert('Vaccine deleted successfully');
            } else {
                const error = await response.json();
                alert('Error deleting vaccine: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting vaccine:', error);
            alert('Error deleting vaccine: ' + error.message);
        }
    }
}

async function updateQueueStatus(queueId, status) {
    try {
        const response = await authenticatedFetch(`${API_URL}/queue/${queueId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            await loadQueue();
            alert('Queue status updated successfully');
        } else {
            const error = await response.json();
            alert('Error updating queue status: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating queue status:', error);
        alert('Error updating queue status: ' + error.message);
    }
}

async function editVaccinationRecord(id) {
    try {
        console.log('Fetching record:', id); // Debug log
        const response = await authenticatedFetch(`${API_URL}/vaccination-records/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const record = await response.json();
        console.log('Fetched record:', record); // Debug log
        
        // Populate form
        const form = document.getElementById('addVaccinationRecordForm');
        form.recordPatient.value = record.patient_id;
        form.recordVaccine.value = record.vaccine_id;
        form.recordDose.value = record.dose_number;
        form.recordRemarks.value = record.remarks || '';
        
        // Disable patient and vaccine selection since we're editing
        form.recordPatient.disabled = true;
        form.recordVaccine.disabled = true;
        
        // Change form submission to update
        form.onsubmit = (e) => {
            e.preventDefault();
            updateVaccinationRecord(id);
        };
        
        // Update modal title
        const modalTitle = document.querySelector('#addVaccinationRecordModal .modal-title');
        modalTitle.textContent = 'Edit Vaccination Record';
        
        // Update submit button text
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Update Record';
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addVaccinationRecordModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching record:', error);
        alert('Error fetching record: ' + error.message);
    }
}

async function updateVaccinationRecord(id) {
    const form = document.getElementById('addVaccinationRecordForm');
    const data = {
        dose_number: parseInt(document.getElementById('recordDose').value),
        remarks: document.getElementById('recordRemarks').value || null
    };
    
    try {
        console.log('Updating record:', id, data); // Debug log
        const response = await authenticatedFetch(`${API_URL}/vaccination-records/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const updatedRecord = await response.json();
            console.log('Updated record:', updatedRecord); // Debug log
            
            // Update the record in the local array
            const index = vaccinationRecords.findIndex(r => r.record_id === id);
            
            // If found, replace the old record with the updated one
            if (index !== -1) {
                console.log('Replacing record at index:', index, 'Old:', vaccinationRecords[index], 'New:', updatedRecord); // Debug log
                vaccinationRecords[index] = updatedRecord;
            } else {
                console.warn('Updated record not found in local array with ID:', id); // Debug log
            }
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addVaccinationRecordModal'));
            modal.hide();
            
            // Reset form and re-enable fields
            form.reset();
            form.recordPatient.disabled = false;
            form.recordVaccine.disabled = false;
            
            // Reset modal title and button
            const modalTitle = document.querySelector('#addVaccinationRecordModal .modal-title');
            modalTitle.textContent = 'Add Vaccination Record';
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.textContent = 'Add Record';
            
            // Reset form submission handler
            form.onsubmit = (e) => {
                e.preventDefault();
                addVaccinationRecord();
            };
            
            // Update the table with the new data
            updateVaccinationRecordsTable();
            alert('Record updated successfully');
        } else {
            const error = await response.json();
            alert('Error updating record: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating record:', error);
        alert('Error updating record: ' + error.message);
    }
}

async function viewRecordHistory(id) {
    try {
        const response = await authenticatedFetch(`${API_URL}/vaccination-records/${id}/history`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const history = await response.json();
        
        // Create history modal content
        const historyContent = history.map(item => `
            <div class="history-item mb-3">
                <div class="d-flex justify-content-between">
                    <strong>Modified by: ${item.modified_by_name}</strong>
                    <span>${formatDate(item.modified_at)}</span>
                </div>
                <div class="changes">
                    ${item.old_dose_number !== item.new_dose_number ? 
                        `<p>Dose Number: ${item.old_dose_number} → ${item.new_dose_number}</p>` : ''}
                    ${item.old_remarks !== item.new_remarks ? 
                        `<p>Remarks: ${item.old_remarks || 'None'} → ${item.new_remarks || 'None'}</p>` : ''}
                </div>
            </div>
        `).join('');
        
        // Show history in modal
        const historyModal = document.getElementById('recordHistoryModal');
        const historyBody = historyModal.querySelector('.modal-body');
        historyBody.innerHTML = historyContent;
        
        const modal = new bootstrap.Modal(historyModal);
        modal.show();
    } catch (error) {
        console.error('Error fetching history:', error);
        alert('Error fetching history: ' + error.message);
    }
} 