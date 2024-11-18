let shopItemsData = [];

// Fetch items data from API and populate the shop
const fetchItemsData = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/items');
        shopItemsData = await response.json();
        generateShop();  // Call generateShop after fetching data
    } catch (error) {
        console.error('Error fetching items data:', error);
    }
};

// Navbar scroll effect
let nav = document.querySelector(".headers");
window.onscroll = function () {
    if (document.documentElement.scrollTop > 400) {
        nav.classList.add("headers-scrolled");
    } else {
        nav.classList.remove("headers-scrolled");
    }
};

// Getting references to DOM elements
let shop = document.getElementById("shop");
let basket = JSON.parse(localStorage.getItem("data")) || [];

// Search bar event listener
let searchBar = document.getElementById("searchBar");
searchBar.addEventListener("input", () => {
    let query = searchBar.value.toLowerCase();
    generateShop(query);
});

// Generate shop items based on search query
// Generate shop items based on search query
let generateShop = (query = "") => {
    shop.innerHTML = shopItemsData
        .filter((x) => {
            return (
                x.name.toLowerCase().includes(query) ||
                x.desc.toLowerCase().includes(query) 
            );
        })
        .map((x) => {
            let { id, name, price, desc, img, in_stock } = x;
            let search = basket.find((x) => x.id === id) || {};
            let outOfStockLabel = in_stock === 0 ? '<span class="out-of-stock-label">Out of Stock</span>' : '';
            let disableButtons = in_stock === 0 ? 'disabled' : ''; // Disable buttons if out of stock
            let outOfStockClass = in_stock === 0 ? 'out-of-stock' : ''; // Add out-of-stock class

            return `
                <div id="product-id-${id}" class="item ${outOfStockClass}">
                    <img class="${in_stock === 0 ? 'grayscale' : ''}" width="220" src="${img}" alt="${name}">
                    <div class="details">
                        <h4>${name}</h4>
                        <p>${desc}</p>
                        <div class="price-quantity">
                            <h2>Rs ${price}</h2>
                            <div class="buttons">
                                <i onclick="decrement(${id})" class="bi bi-dash-lg" ${disableButtons}></i>
                                <div id="${id}" class="quantity">
                                    ${search.item === undefined ? 0 : search.item}
                                </div>
                                <i onclick="increment(${id})" class="bi bi-plus-lg" ${disableButtons}></i>
                            </div>
                        </div>
                    </div>
                    ${outOfStockLabel}
                </div>
            `;
        })
        .join("");
};

// Add some CSS to style the "Out of Stock" label and its position
let style = document.createElement('style');
style.innerHTML = `
    .out-of-stock-label {
        color: red;
        font-weight: bold;
        font-size: 30px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 5px 10px;
        border-radius: 5px;
    }
    .item {
        position: relative; /* This is important for absolute positioning of the label */
    }
    .item .buttons i[disabled] {
        color: #ccc; /* Disabled button color */
        pointer-events: none; /* Prevent clicking */
    }
    .item.out-of-stock .details {
        opacity: 0.5; /* Optional: Reduce opacity of details when out of stock */
    }
    /* Grayscale image when out of stock */
    .grayscale {
        filter: grayscale(70%);
         opacity: 0.5;
        
    }
`;
document.head.appendChild(style);


// Call fetchItemsData to initially populate the items
fetchItemsData();

// Increment function for adding items to the cart
let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem);

    if (search === undefined) {
        basket.push({
            id: selectedItem,
            item: 1,
        });
    } else {
        search.item += 1;
    }

    update(selectedItem);
    localStorage.setItem("data", JSON.stringify(basket));
};

// Decrement function for removing items from the cart
let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem);

    if (search === undefined || search.item === 0) return;
    search.item -= 1;
    update(selectedItem);
    basket = basket.filter((x) => x.item !== 0);
    localStorage.setItem("data", JSON.stringify(basket));
};

// Update function to refresh quantity display in the cart
let update = (id) => {
    let search = basket.find((x) => x.id === id);
    document.getElementById(id).innerHTML = search ? search.item : 0;
    calculation();
};

// Calculate the total number of items in the cart
let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

// Log-out function with SweetAlert confirmation
function logoutUser() {
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
            Swal.fire({
                icon: "success",
                title: "Logged Out",
                showConfirmButton: false,
                timer: 1500,
                width: '400px',
                padding: '20px',
            }).then(() => {
                fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        sessionStorage.setItem('isCustomerLoggedIn_' + customerId, 'false');
                        sessionStorage.setItem('isAdminLoggedIn_' + customerId, 'false');
                        window.location.href = 'index.html';
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

// Clear search button visibility
const clearSearch = document.getElementById("clearSearch");
searchBar.addEventListener("input", () => {
    if (searchBar.value) {
        clearSearch.style.display = "inline";
    } else {
        clearSearch.style.display = "none";
    }
});

// Clear the search input and reset search results
clearSearch.addEventListener("click", () => {
    searchBar.value = "";
    clearSearch.style.display = "none";
    generateShop(); // Reset to show all products
    searchBar.focus(); // Optionally, keep focus on the input
});
function clearInput() {
    emailInput.value = '';
}
// Email subscription functionality
const emailInput = document.querySelector('input[type="email"].form-control.bg-transparent');
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

    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "We Got Your E-Mail",
                text: "Thank you for subscribing!",
                showConfirmButton: false,
                timer: 1500,
            });
            const emailInput = document.querySelector('input[type="email"].form-control.bg-transparent');
                emailInput.value = '';
            
        } else if (response.status === 409) {
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
