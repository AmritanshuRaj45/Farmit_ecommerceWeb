// Check if the user is logged in and has admin privileges
const customerId = sessionStorage.getItem('customerId');
if (localStorage.getItem('loginStatus_' + customerId) === 'loggedIn' && sessionStorage.getItem('isAdminLoggedIn_' + customerId) === 'true') {
    window.onload = function() {
        const username = sessionStorage.getItem('username');
        console.log(username);
       const usernameElement = document.getElementById('username-display');
       if (username && usernameElement) {
           usernameElement.textContent = username;
       }
       const check_login=localStorage.getItem('loginStatus_' + customerId); 
       if (check_login === 'loggedOut') {
           window.location.replace("index.html");
       }
        fetchCustomerData();
    };
}

// Function to fetch customer data with JWT authentication
function fetchCustomerData() {
    // Get the token from sessionStorage
    const token = sessionStorage.getItem('token_' + customerId);
    
    if (!token) {
        alert('No token found. Please log in first.');
        return;
    }

    // Add a timestamp to prevent caching issues
    fetch('/api/customers?' + new Date().getTime(), {
        method: 'GET', // GET request to fetch data
        headers: {
            'Authorization': `Bearer ${token}` // Add the token to the Authorization header
        }
    })
    .then(response => {
        // Check if the response is successful
        if (!response.ok) {
            // If not authorized (401) or other errors, redirect to login page
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
            const tableBody = document.getElementById('customerTableBody');

            // Avoid direct manipulation of innerHTML in the loop to reduce reflows/repaints
            let rows = '';  // Store all rows in a string
            data.forEach((customer, index) => {
                // Check if customer object contains the expected properties
                if (customer.id && customer.name && customer.email && customer.phone && customer.city && customer.total_orders) {
                    rows += `
                        <tr>
                            <td>${customer.id}</td>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.city}</td>
                            <td>${customer.total_orders}</td>
                        </tr>
                    `;
                } else {
                    console.warn('Customer data is missing some expected fields:', customer);
                }
            });

            // Set all rows at once to the table body
            tableBody.innerHTML = rows;
        } else {
            console.error('Expected an array, but received:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching customer data:', error);
        alert('Error fetching customer data.');
    });
}

// Exporting to Excel (xlsx)
document.getElementById('exportExcBtn').addEventListener('click', function() {
    const table = document.querySelector('.customer-table');  // Make sure this matches your table class
    
    if (!table) {
        console.error('Table element not found.');
        return;
    }

    // Create workbook from the table
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    // Create a Blob and trigger the download
    XLSX.writeFile(wb, 'customers.xlsx');
});
