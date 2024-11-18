const customerId = sessionStorage.getItem('customerId');  // Or pass it dynamically

// Retrieve token and role for the specific customerId
const token = sessionStorage.getItem('token_' + customerId);
// Header Scroll 
let nav = document.querySelector(".navbar");
window.onscroll = function() {
    if(document.documentElement.scrollTop > 50){
        nav.classList.add("header-scrolled"); 
    }else{
        nav.classList.remove("header-scrolled");
    }
}


// nav hide  
let navBar = document.querySelectorAll(".nav-link");
let navCollapse = document.querySelector(".navbar-collapse.collapse");
navBar.forEach(function(a){
    a.addEventListener("click", function(){
        navCollapse.classList.remove("show");
    })
})
function contact(event) {
    event.preventDefault(); // Prevent default submission
    
    const form = document.getElementById('contactForm');
    if (!form.checkValidity()) {
        form.reportValidity(); // Shows validation errors if form is invalid
        return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
      // Regular expressions for validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
      const phonePattern = /^\d{10}$/; // Exactly 10 digits for phone number
  
      // Validate email
      if (!emailPattern.test(data.email)) {
          Swal.fire({
              icon: "error",
              title: "Invalid Email",
              text: "Please enter a valid email address.",
              showConfirmButton: true,
          });
          return;
      }
  
      // Validate phone number
      if (!phonePattern.test(data.phone)) {
          Swal.fire({
              icon: "error",
              title: "Invalid Phone Number",
              text: "Please enter a 10-digit phone number.",
              showConfirmButton: true,
          });
          return;
      }

    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                alert('You are not authorized. Please log in!');
                window.location.href = '/index'; // Redirect to index page if unauthorized
                return;
            }

            throw new Error('Failed to submit contact form. Please try again later.');
        }

        return response.json();
    })
    .then(data => {
        if (data.message) {
            Swal.fire({
                title: 'Message sent!',
                text: 'Your message has been submitted successfully.',
                icon: 'success',
            });
            clearContact();
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Error!',
            text: 'There was an error submitting your message. Please try again later.',
            icon: 'error'
        });
        console.error('Error:', error);
    });
}

const emailInput = document.querySelector('input[type="email"].form-control.bg-transparent');
function clearContact() {
   
        document.getElementById("contactForm").reset();
      
}
function clearInput() {
    emailInput.value = '';
}

async function email() {
    const email = emailInput.value.trim();

    if (!email) {
        Swal.fire({
            icon: "error",
            title: "Email Required",
            text: "Please enter your email address.",
            showConfirmButton: true,
        });
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address.",
            showConfirmButton: true,
        });
        return;
    }

    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        console.log(result);
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "We Got Your E-Mail",
                text: "Thank you for subscribing!",
                showConfirmButton: false,
                timer: 1500,
     
            });

            clearInput();
        } else if (response.status === 409) {
            // Handling the 409 Conflict - Duplicate email
            Swal.fire({
                icon: "error",
                title: "Email Already Subscribed",

                showConfirmButton: true,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Subscription Failed",
                text: result.message || "An error occurred while subscribing. Please try again.",
                showConfirmButton: true,
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Unable to connect. Please try again later.",
            showConfirmButton: true,
        });
        console.error('Subscription error:', error);
    }
}

function toggleProducts() {
    const moreProducts = document.getElementById('more-products');
    if (moreProducts.style.display === "none") {
        moreProducts.style.display = "block";
    } else {
        moreProducts.style.display = "none";
    }
    const exp = document.getElementById('exp');
    exp.style.display="none";
}
window.addEventListener('load', () => {
    const registrationSuccess = localStorage.getItem('loginSuccess');

    if (registrationSuccess === 'true') {
        // Show SweetAlert message
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Logged in successfully"
          }).then(() => {
            // Clear the flag after showing the alert
            localStorage.removeItem('loginSuccess');
        });
    }
});

const admin_registration = () => {
    // Set a flag in sessionStorage to indicate the button was clicked
    sessionStorage.setItem('showRoleDropdown', 'true');

   
    // Redirect to the registration page
    window.location.href = 'register.html';
};
document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    const customerId = sessionStorage.getItem('customerId');

    if (!customerId) {
        alert('No customer ID found in session storage.');
        return;
    }

    const confirmation = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete your account? This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });

    if (confirmation.isConfirmed) {
        try {
            
            const response = await fetch('/api/auth/deleteAccount', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerId })
            });

            const result = await response.json();
            if (response.ok) {
                await Swal.fire('Deleted!', result.message, 'success');
                sessionStorage.clear();
            
                    window.location.href = '/index.html';
               // Redirect after 1.5 seconds to give time for Swal to display
            } else {
                Swal.fire('Error!', result.message || 'Failed to delete account', 'error');
            }
            
        } catch (error) {
            Swal.fire('Error!', 'An error occurred. Please try again later.', 'error');
        }
    }
});
