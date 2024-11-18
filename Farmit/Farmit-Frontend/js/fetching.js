const customerId = sessionStorage.getItem('customerId');
// Fetch feedback data with JWT token in sessionStorage
fetch('/api/feedback?' + new Date().getTime(), {
    method: 'GET',  // GET request to fetch data
    headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token_' + customerId)}` // Add token from sessionStorage
    }
})
.then(response => {
    if (!response.ok) {
        // If not authorized (401) or other errors, handle appropriately
        if (response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/index'; // Redirect to login page
        }
        throw new Error('Network response was not ok');
    }
    return response.json();  // Parse the response as JSON
})
.then(data => {
    // Ensure that the data is an array before using forEach
    if (Array.isArray(data)) {
        const tableBody = document.getElementById('feedbackTableBody');
        tableBody.innerHTML = '';  // Clear existing rows

        // Add new feedback rows to the table
        data.forEach((feedback, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${feedback.name}</td>
                    <td>${feedback.email}</td>
                    <td>${feedback.address}</td>
                    <td>${feedback.phone}</td>
                    <td>${feedback.message}</td>
                    <td>${new Date(feedback.submitted_at).toLocaleString()}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } else {
        console.error('Expected an array, but received:', data);
    }
})
.catch(error => {
    console.error('Error fetching feedback data:', error);
    alert('Error fetching feedbacks.');
});

// Exporting feedback to Excel (xlsx)
document.getElementById('exportExcBtn').addEventListener('click', function() {
    var table = document.querySelector('.feedback-table');  // Ensure this matches your table class
    
    if (!table) {
        console.error('Table element not found.');
        return;
    }

    // Create workbook from the table
    var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    // Create a Blob and trigger the download
    XLSX.writeFile(wb, 'feedback.xlsx');
});
