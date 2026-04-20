const apiUrl = 'https://mediqueue-api-99d9.onrender.com/api/patients';
const form = document.getElementById('registrationForm');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const patientIdInput = document.getElementById('patientId');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const queueBody = document.getElementById('queueBody');

// Fetch and display all patients
async function fetchPatients() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch patients');
        const patients = await response.json();
        
        // Sort by token number to maintain queue order
        patients.sort((a, b) => a.tokenNumber - b.tokenNumber);
        
        renderQueue(patients);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Render the patients in the table
function renderQueue(patients) {
    queueBody.innerHTML = ''; // Clear existing rows

    if(patients.length === 0) {
        queueBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No patients in queue</td></tr>';
        return;
    }

    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="token-badge">#${patient.tokenNumber}</span></td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editPatient(${patient.id}, '${patient.name}', ${patient.age})">Edit</button>
                <button class="action-btn delete-btn" onclick="deletePatient(${patient.id})">Delete</button>
            </td>
        `;
        queueBody.appendChild(row);
    });
}

// Handle Form Submission (Add or Update)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const patientData = {
        name: nameInput.value,
        age: parseInt(ageInput.value)
    };

    const id = patientIdInput.value;

    try {
        let response;
        if (id) {
            // Update existing patient
            response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            });
        } else {
            // Register new patient
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            });
        }

        if (!response.ok) throw new Error('Failed to save patient');

        resetForm();
        fetchPatients();
    } catch (error) {
        console.error('Error:', error);
    }
});

// Setup form for editing
window.editPatient = (id, name, age) => {
    patientIdInput.value = id;
    nameInput.value = name;
    ageInput.value = age;
    
    submitBtn.textContent = 'Update Patient';
    cancelBtn.classList.remove('hidden');
};

// Cancel editing
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    form.reset();
    patientIdInput.value = '';
    submitBtn.textContent = 'Generate Token';
    cancelBtn.classList.add('hidden');
}

// Delete patient
window.deletePatient = async (id) => {
    if (!confirm('Are you sure you want to remove this patient from the queue?')) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete patient');

        fetchPatients();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Initial load
document.addEventListener('DOMContentLoaded', fetchPatients);
