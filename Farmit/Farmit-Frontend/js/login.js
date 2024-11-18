document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            document.getElementById('errorMessage').innerText = errorText;
            document.getElementById('errorMessage').style.color = 'red';
            clearInputFields();
            return;
        }

        const responseData = await response.json();
        const { token, customerId, username: responseUsername, redirectUrl, message, proceed } = responseData;

        if (!proceed) {
            // Show confirmation dialog only when there's an existing session
            const { value: confirmProceed } = await Swal.fire({
                title: 'Active Session',
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Proceed',
                cancelButtonText: 'Cancel'
            });

            if (!confirmProceed) {
                clearInputFields();
                return;
            }
        }

        // Clear any existing sessions
        clearExistingSession(customerId);

        // Set up new session
        setupNewSession(customerId, token, role, responseUsername);

        // Redirect to appropriate dashboard
        window.location.href = redirectUrl;
        clearInputFields();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.';
        document.getElementById('errorMessage').style.color = 'red';
        clearInputFields();
    }
});

function clearExistingSession(customerId) {
    localStorage.removeItem(`sessionId_${customerId}`);
    sessionStorage.removeItem('token_' + customerId);
    sessionStorage.removeItem('customerId');
    sessionStorage.removeItem('isAdminLoggedIn_' + customerId);
    sessionStorage.removeItem('isCustomerLoggedIn_' + customerId);
    sessionStorage.removeItem('adminId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('loginSuccess');
    sessionStorage.removeItem('role');
    localStorage.setItem('loginStatus_' + customerId, 'loggedOut');
}

function setupNewSession(customerId, token, role, username) {
    localStorage.setItem('loginStatus_' + customerId, 'loggedIn');
    const sessionId = `session_${customerId}_${Date.now()}`;
    localStorage.setItem(`sessionId_${customerId}`, sessionId);
    
    sessionStorage.setItem('token_' + customerId, token);
    sessionStorage.setItem('customerId', customerId);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('loginSuccess', 'true');
    sessionStorage.setItem('username', username);
    
    if (role === 'admin') {
        sessionStorage.setItem('isAdminLoggedIn_' + customerId, 'true');
        sessionStorage.setItem('adminId', customerId);
    } else if (role === 'customer') {
        sessionStorage.setItem('isCustomerLoggedIn_' + customerId, 'true');
    }
    
    
}

function clearInputFields() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}