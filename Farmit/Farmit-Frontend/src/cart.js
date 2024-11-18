let shopItemsData = [];

const fetchItemsData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/items');
    shopItemsData = await response.json();
    generateCartItems();
    TotalAmount();
  } catch (error) {
    console.error('Error fetching items data:', error);
  }
};

// Fetch items data when the page loads
fetchItemsData();
let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");
localStorage.setItem('checkout', 'false');

let basket = JSON.parse(localStorage.getItem("data")) || [];

// Function to calculate and update cart icon
let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

// Initial calculation of cart items
calculation();

// Function to generate cart items display
let generateCartItems = () => {
  if (basket.length !== 0) {
    ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return `
      <div class="cart-item">
        <img width="200" src="${search.img}" alt="" />
        <div class="details">
          <div class="title-price-x">
              <h4 class="title-price">
                <p class="item-name">${search.name}</p>
                <p class="cart-item-price">Rate= ${search.price}</p>
              </h4>
           
          </div>
          <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
              <div id="${id}" class="quantity">${item}</div>
              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
          </div>
          <p class="cart-item-price2">Subtotal= ${item * search.price}</p>

        </div>
          
      </div>
      <div class="x"> <i onclick="removeItem(${id})" class="bi bi-x-lg"></i></div>
      <div class="rem">remove item</div>
      `;
      })
      .join("");
  } else {
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <h2>Your Cart is Empty</h2><br>
    <a href="cart.html">
      <button class="HomeBtn">Back to Cart</button>
    </a>
    `;
  }
};

// Generate cart items initially
generateCartItems();

// Increment function to add items to the cart
let increment = (id) => {
  let selectedItem = parseInt(id, 10); // Ensure id is treated as an integer
  let search = basket.find((x) => x.id === selectedItem);

  if (search === undefined) {
    basket.push({
      id: selectedItem,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  generateCartItems();
  update(selectedItem);
  localStorage.setItem("data", JSON.stringify(basket));
};

// Decrement function to remove items from the cart
let decrement = (id) => {
  let selectedItem = parseInt(id, 10); // Ensure id is treated as an integer
  let search = basket.find((x) => x.id === selectedItem);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

// Update function to refresh item quantities
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  TotalAmount();
};

// Remove item from the cart
let removeItem = (id) => {
  let selectedItem = parseInt(id, 10); // Ensure id is treated as an integer
  basket = basket.filter((x) => x.id !== selectedItem);
  generateCartItems();
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

// Clear all items from the cart
let clearCart = () => {
  if (localStorage.getItem('checkout') === 'false') {
  // Display the loading alert
Swal.fire({
  title: 'Clearing your cart...',
  text: 'Please wait',
  allowOutsideClick: false,
  showConfirmButton: false,
  didOpen: () => {
    Swal.showLoading();
  }
});

// Close the alert after 1 second
setTimeout(() => {
  Swal.close();
}, 500);

  basket = [];
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = 0;
}else{
  basket = [];
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = 0;

};
}

// Calculate total amount for the cart
let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return item * search.price;
      })
      .reduce((x, y) => x + y, 0);
    label.innerHTML = `
          <h2 style="color: rgba(0, 0, 0, 0.619);">Total Bill : Rs ${amount}</h2><br>
        <button onclick="handleCheckout()" id="checkout" class="checkout">Checkout</button>
        <button onclick="clearCart()" class="removeAll">Clear Cart</button>
        `;
  } else return;
};

// Calculate total amount initially
TotalAmount();

async function handleCheckout() {
  const customerId = getCustomerId();

  const items = basket.map(item => {
    const productData = shopItemsData.find(product => product.id === item.id);
    return {
      productId: item.id,
      quantity: item.item,
      price: productData.price,
      product_name: productData.name,
      description: productData.desc
    };
  });

  const totalAmount = items.reduce((total, item) => total + (item.quantity * item.price), 0);

  // Add custom styles to override default styles
// Only showing the modified styles for brevity - the rest of the code remains the same

const customStyles = document.createElement('style');
customStyles.textContent = `
   .swal2-popup.shipping-form-popup {
    width: 45em !important;  /* Increased width further */
    padding: 2em !important;
    background: #ffffff !important;
    border-radius: 15px !important;
    height:auto;
  }

  .swal2-popup.shipping-form-popup .swal2-title {
    color: #333333 !important;
    font-size: 2.2em !important;  /* Increased from 1.8em */
    font-weight: 600 !important;
    margin-bottom: 1.5em !important;
    padding: 0 !important;
    text-transform: uppercase !important;  /* Added for emphasis */
    letter-spacing: 0.5px !important;
  }

  .swal2-popup.shipping-form-popup .shipping-form {
    text-align: left !important;
    padding: 0 1.5em !important; /* Increased from 1em */
  }

   .swal2-popup.shipping-form-popup .form-group {
    margin-bottom: 2em !important;  /* Increased from 1.8em */
    position: relative !important;
  }

 .swal2-popup.shipping-form-popup .form-group label {
    display: block !important;
    margin-bottom: 0.7em !important;
    color: #333333 !important;
    font-weight: 600 !important;
    font-size: 1.4em !important;  /* Increased from 1.1em */
    letter-spacing: 0.3px !important;
  }


  .swal2-popup.shipping-form-popup .form-group input {
    width: 100% !important;
    padding: 1.2em 1.4em !important;  /* Increased padding */
    border: 2px solid #e1e1e1 !important;
    border-radius: 8px !important;
    font-size: 1.3em !important;  /* Increased from 1.1em */
    line-height: 1.5 !important;
    margin: 0 !important;
    box-shadow: none !important;
    background-color: #ffffff !important;
    transition: border-color 0.2s ease-in-out !important;
    height: auto !important;
  }

  .swal2-popup.shipping-form-popup .form-group input:focus {
    border-color: #3085d6 !important;
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(48, 133, 214, 0.2) !important;  /* Increased from 2px */
  }

.swal2-popup.shipping-form-popup .form-group input::placeholder {
    font-size: 1em !important;  /* Relative to input font-size */
    color: #888 !important;
    opacity: 0.8 !important;
  }

  .swal2-popup.shipping-form-popup .error-message {
    color: #dc3545 !important;
    font-size: 1.1em !important;  /* Increased from 0.9em */
    margin-top: 0.4em !important;
    display: block !important;
    position: absolute !important;
    bottom: -1.6em !important;
  }

  .swal2-popup.shipping-form-popup .swal2-actions {
    margin-top: 3em !important;  /* Increased from 2.5em */
    gap: 1.5em !important;  /* Increased from 1.2em */
  }

  .swal2-popup.shipping-form-popup .swal2-confirm,
  .swal2-popup.shipping-form-popup .swal2-cancel {
    padding: 1em 2.8em !important;  /* Increased padding */
    border-radius: 10px !important;
    font-weight: 600 !important;
    font-size: 1.4em !important;  /* Increased from 1.1em */
    border: none !important;
    transition: all 0.2s ease-in-out !important;
    text-transform: uppercase !important;  /* Added for emphasis */
    letter-spacing: 0.5px !important;
  }

  .swal2-popup.shipping-form-popup .swal2-confirm {
    background-color: #28a745 !important;
    color: white !important;
  }

  .swal2-popup.shipping-form-popup .swal2-cancel {
    background-color: #dc3545 !important;
    color: white !important;
  }

  .swal2-popup.shipping-form-popup .swal2-confirm:hover {
    background-color: #218838 !important;
    transform: translateY(-1px) !important;
  }

  .swal2-popup.shipping-form-popup .swal2-cancel:hover {
    background-color: #c82333 !important;
    transform: translateY(-1px) !important;
  }

  .swal2-popup.success-popup {
    padding: 2.5em !important;  /* Increased from 2em */
    border-radius: 15px !important;
    width: 35em !important;  /* Added explicit width */
  }

  .swal2-popup.success-popup .swal2-title {
    color: #28a745 !important;
    font-size: 2em !important;  /* Increased from 1.8em */
    font-weight: 600 !important;
  }
`;
  document.head.appendChild(customStyles);

  const { value: addressDetails } = await Swal.fire({
    title: 'Shipping Details',
    html: `
      <div class="shipping-form">
        <div class="form-group">
          <label for="houseName">House Name/Number*</label>
          <input 
            id="houseName" 
            type="text" 
            placeholder="Enter house name/number"
            required
          />
          <span id="houseNameError" class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="streetName">Street Name*</label>
          <input 
            id="streetName" 
            type="text" 
            placeholder="Enter street name"
            required
          />
          <span id="streetNameError" class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="city">City*</label>
          <input 
            id="city" 
            type="text" 
            placeholder="Enter city"
            required
          />
          <span id="cityError" class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="pincode">Pincode*</label>
          <input 
            id="pincode" 
            type="number" 
            placeholder="Enter pincode"
            minlength="6"
            maxlength="6"
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            required
          />
          <span id="pincodeError" class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="state">State*</label>
          <input 
            id="state" 
            type="text" 
            placeholder="Enter state"
            required
          />
          <span id="stateError" class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="phone">Phone Number*</label>
          <input 
            id="phone" 
            type="number" 
            placeholder="Enter phone number"
            minlength="10"
            maxlength="10"
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            required
          />
          <span id="phoneError" class="error-message"></span>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Proceed to Checkout',
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'shipping-form-popup'
    },
    preConfirm: () => {
      // Get values and remove extra spaces
      const houseName = document.getElementById('houseName').value.trim();
      const streetName = document.getElementById('streetName').value.trim();
      const city = document.getElementById('city').value.trim();
      const pincode = document.getElementById('pincode').value.trim();
      const state = document.getElementById('state').value.trim();
      const phone = document.getElementById('phone').value.trim();

      // Reset error messages
      document.querySelectorAll('.error-message').forEach(elem => elem.textContent = '');

      // Validation flags
      let isValid = true;

      // Validate each field
      if (!houseName) {
        document.getElementById('houseNameError').textContent = 'House name/number is required';
        isValid = false;
      }

      if (!streetName) {
        document.getElementById('streetNameError').textContent = 'Street name is required';
        isValid = false;
      }

      if (!city) {
        document.getElementById('cityError').textContent = 'City is required';
        isValid = false;
      }

      if (!pincode) {
        document.getElementById('pincodeError').textContent = 'Pincode is required';
        isValid = false;
      } else if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
        document.getElementById('pincodeError').textContent = 'Please enter a valid 6-digit pincode';
        isValid = false;
      }

      if (!state) {
        document.getElementById('stateError').textContent = 'State is required';
        isValid = false;
      }

      if (!phone) {
        document.getElementById('phoneError').textContent = 'Phone number is required';
        isValid = false;
      } else if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        document.getElementById('phoneError').textContent = 'Please enter a valid 10-digit phone number';
        isValid = false;
      }

      if (!isValid) {
        return false;
      }

      const fullAddress = `${houseName}, ${streetName}, ${city}- ${pincode}, ${state}, Phone: ${phone}`;
      return fullAddress;
    }
  });

  if (addressDetails) {
    try {
      const response = await axios.post('http://localhost:5000/api/checkout', {
        customerId,
        totalAmount,
        items,
        address: addressDetails
      });

  
      localStorage.setItem('checkout', 'true');
      
      Swal.fire({
        icon: "success",
        title: "We Got Your Order",
        html: "<span style='font-size: 2rem; color: #60cd12;'>Thank you for buying from us!</span>",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: 'success-popup'
        }
      });

      clearCart();
      let cartIcon = document.getElementById("cartAmount");
      cartIcon.innerHTML = 0;
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Network error, please try again later.';
      console.error('Error placing order:', errorMessage);
      
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    }
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Order not Completed',
      text: 'Checkout process was canceled',
      confirmButtonText: 'OK'
    });
  }
}
// Dummy function for example
function getCustomerId() {
  return parseInt(sessionStorage.getItem('customerId')) || 1; // Replace with actual logic
}
