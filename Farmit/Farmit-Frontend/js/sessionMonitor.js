window.addEventListener('storage', (event) => {
    // Ensure we are listening to the correct user's logout event
    const customerId = sessionStorage.getItem('customerId'); // Get the current user's customerId
    if (event.key === 'loginStatus_' + customerId && event.newValue === 'loggedOut') {
        // If the current user's loginStatus is set to loggedOut, log them out
        sessionStorage.clear(); // Clear the session
        window.location.href = '/index'; // Redirect to the default page (index)
        localStorage.setItem('loginStatus_' + customerId, 'loggedOut');
    }
  }); 
   const role = sessionStorage.getItem('role');
  function isTokenExpired(token) {
    if (!token) return true;
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return exp < currentTime;
}

function checkLoginStatus() {
    const customerId = sessionStorage.getItem('customerId');
    const token = sessionStorage.getItem('token_' + customerId);
    const loginStatus = localStorage.getItem('loginStatus_' + customerId);


    if (!token || loginStatus === 'loggedOut' || isTokenExpired(token)) {
        Swal.fire({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "info",
            confirmButtonText: "OK",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            sessionStorage.clear();
            localStorage.removeItem(`sessionId_${customerId}`);
            localStorage.setItem('loginStatus_' + customerId, 'loggedOut');
    
            // Redirect after logout
            window.location.href = '/index'; // Redirect to index page
        });
    }
        }
    


// Periodically check token status every 30 seconds
setInterval(checkLoginStatus, 10000); // 30000ms = 30 seconds

  
    //log-out
    function logoutUser() {
        const customerId = sessionStorage.getItem('customerId'); // Retrieve the customerId once
        Swal.fire({
            title: "Are you sure you want to log out?",
            text: "You will be redirected to the home page.",
            icon: "question",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            showCancelButton: true,
            showCloseButton: true,
            customClass: {
                popup: 'custom-swal-popup' // Custom styling class
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Show a success message before logout
                Swal.fire({
                    icon: "success",
                    title: "Logged Out",
                    showConfirmButton: false,
                    timer: 1500,
                    width: '400px',
                    padding: '20px',
                }).then(() => {
                    // Proceed with the logout request after success alert
                    fetch('/api/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ customerId }) // Send customerId in the request body
                    })
                    .then(response => {
                        if (response.ok) {
                            // Clear the current user's session data on success
                            localStorage.removeItem(`sessionId_${customerId}`);
                            sessionStorage.removeItem('token_' + customerId);
                            sessionStorage.removeItem('customerId');
                            sessionStorage.removeItem('isAdminLoggedIn_' + customerId);
                            sessionStorage.removeItem('isCustomerLoggedIn_' + customerId);
                            sessionStorage.removeItem('adminId');
                            sessionStorage.removeItem('username');
                            sessionStorage.removeItem('loginSuccess');
                            
                            // Notify other tabs about the logout status
                            localStorage.setItem('loginStatus_' + customerId, 'loggedOut');
    
                            // Redirect after logout
                            window.location.href = '/index'; // Redirect to index page
                        } else {
                            Swal.fire({
                                title: 'Logout failed',
                                text: 'Please try again later.',
                                icon: 'error',
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Logout error:', error);
                        Swal.fire({
                            title: 'An error occurred',
                            text: 'Please try again.',
                            icon: 'error',
                        });
                    });
                });
            }
        });
    }
    
  function toggleLogout() {
      const logoutLink = document.getElementById('logout-link');
      logoutLink.style.display = logoutLink.style.display === 'none' ? 'block' : 'none';
    }