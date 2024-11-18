

const cardContainer = document.getElementById("cardContainer");
const itemDisplayContainer = document.getElementById("itemDisplayContainer");

document.getElementById("addItemButton").addEventListener("click", showAddItemForm);
document.getElementById("removeItemButton").addEventListener("click", showRemoveItemDropdown);
document.getElementById("stockOutButton").addEventListener("click", showStockOutDropdown);
document.getElementById("StockInButton").addEventListener("click", showStockInDropdown);


// Function to fetch and display items from the database
async function displayItems() {
    try {
        const response = await fetch('http://localhost:5000/api/items');
        const shopItemsData = await response.json();
        
        itemDisplayContainer.innerHTML = shopItemsData
            .map(item => `
                <div class="card" style="width: 18rem;">
                    <img src="${item.img}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.desc}</p>
                        <p class="card-text"><strong>Price:</strong> $${item.price}</p>
                    </div>
                </div>
            `)
            .join("");
    } catch (error) {
        console.error('Error fetching items data:', error);
    }
}

// Show form to add a new item
function showAddItemForm() {
   
    cardContainer.innerHTML = `
      <div style="
    width: 500px;
    height: 500px;
    padding: 20px;
    margin: 20px auto;
    background-color: #60cd12;
    backdrop-filter: blur(5px) brightness(0.9); /* Apply backdrop filter effects */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
    font-family: Arial, sans-serif;
    text-align: center;
">
    <h3 style="color: #2c3e50; margin-bottom: 20px;">Add New Item</h3>
<form id="itemForm" action="http://localhost:5000/api/items" method="POST" enctype="multipart/form-data" style="
  width: 90%;
  height: 350px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
" onsubmit="handleSubmit(event)">

  <!-- Name Label and Input -->
<div style="display: flex; align-items: center; margin-bottom: 15px;">
    <label for="name" style="width: 30%; margin-right: 10px; font-size: 18px; font-weight: bold;">Name:</label>
    <input type="text" name="name" id="name" placeholder="Enter the item name" required style="
      width: 70%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    ">
  </div>

  <!-- Price Field with Left-Aligned Label -->
  <div style="display: flex; align-items: center; margin-bottom: 15px;">
    <label for="price" style="width: 30%; margin-right: 10px; font-size: 18px; font-weight: bold;">Price:</label>
    <input type="number" name="price" id="price" placeholder="Enter the item price" required style="
      width: 70%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    ">
  </div>

  <!-- Description Field with Left-Aligned Label -->
  <div style="display: flex; align-items: center; margin-bottom: 15px;">
    <label for="desc" style="width: 30%; margin-right: 10px; font-size: 18px; font-weight: bold;">Category:</label>
    <input type="text" name="desc" id="desc" placeholder="Enter the category" required style="
      width: 70%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    ">
  </div>

  <!-- Image Field with Left-Aligned Label -->
  <div style="display: flex; align-items: center; margin-bottom: 15px;">
    <label for="itemImage" style="width: 30%; margin-right: 10px; font-size: 18px; font-weight: bold;">Image:</label>
    <input type="file" name="itemImage" id="itemImage" required style="
      width: 70%;
      padding: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      background-color: #f1f1f1;
    ">
  </div>


  <!-- Submit Button -->
  <button id="submitButton" type="submit" style="
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #28a745;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
  " onmouseover="this.style.backgroundColor='#218838'" onmouseout="this.style.backgroundColor='#28a745'">
    Add Item
  </button>
</form>

</div>

    `;

}



// Show form to remove items 
function showRemoveItemDropdown() {
  fetch('http://localhost:5000/api/items')
      .then((response) => response.json())
      .then((shopItemsData) => {
          // Store the full data for filtering
          window.allItems = shopItemsData;
          
          const itemList = generateItemList(shopItemsData);

          cardContainer.innerHTML = `
              <div class="remove-items-container" style="background-color: #60cd12;
              backdrop-filter: blur(5px) brightness(0.9);">
                  <div class="header-section">
                      <h3 style="font-size:60px" class="remove-title">Remove Items</h3>
                      <p style="font-size:30px" class="remove-subtitle">Select items to remove from inventory</p>
                  </div>
                  <div class="search-section">
                      <div class="search-container">
                          <input 
                              type="text" 
                              id="searchInput" 
                              class="search-input" 
                              placeholder="Search items..."
                          >
                          <i class="fas fa-search search-icon"></i>
                      </div>
                  </div>
                  <div class="items-grid">
                      <div id="removeItemSelect" class="items-wrapper">
                          ${itemList}
                      </div>
                  </div>
                  <div class="action-section">
                      <button class="remove-button" id="removeButton">
                          <i class="fas fa-trash-alt"></i> Remove Selected Items
                      </button>
                  </div>
              </div>
          `;

          // Add event listeners after elements are created
          document.getElementById('removeButton').addEventListener('click', () => {
              Swal.fire({
                  icon: 'warning',
                  title: 'Confirm Removal',
                  text: 'Are you sure you want to remove the selected items?',
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'No',
              }).then((result) => {
                  if (result.isConfirmed) {
                      removeItems().catch((error) => {
                          console.error('Error removing items:', error);
                          cardContainer.innerHTML = `
                              <div class="error-message">
                                  <p>Error removing items. Please try again later.</p>
                                  <style>
                                      .error-message {
                                          text-align: center;
                                          color: #e74c3c;
                                          padding: 20px;
                                          background: #fdf0ed;
                                          border-radius: 8px;
                                          margin: 20px;
                                      }
                                  </style>
                              </div>
                          `;
                      });
                  }
              });
          });

          document.getElementById('searchInput').addEventListener('input', handleSearch);
      })
      .catch((error) => {
          console.error('Error fetching items for removal:', error);
          cardContainer.innerHTML = `
              <div class="error-message">
                  <p>Error loading items. Please try again later.</p>
                  <style>
                      .error-message {
                          text-align: center;
                          color: #e74c3c;
                          padding: 20px;
                          background: #fdf0ed;
                          border-radius: 8px;
                          margin: 20px;
                      }
                  </style>
              </div>
          `;
      });
}

// Function to generate item list HTML
function generateItemList(items) {
    return items
        .map((item) => `
            <div class="item-card">
                <div class="form-check item-check">
                    <input class="form-check-input" type="checkbox" value="${item.id}" id="itemCheck${item.id}">
                    <label class="form-check-label item-label" for="itemCheck${item.id}">
                        <div class="item-image-container">
                            <img src="${item.img}" alt="${item.name}" class="item-image">
                        </div>
                        <div class="item-details">
                            <span class="item-name">${item.name}</span>
                            <span class="item-id">Product ID: ${item.id}</span>
                        </div>
                    </label>
                </div>
            </div>
        `)
        .join("");
}

// Function to handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredItems = window.allItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.id.toString().includes(searchTerm)
    );
    
    const itemsContainer = document.getElementById('removeItemSelect');
    itemsContainer.innerHTML = generateItemList(filteredItems);
}
// Function to remove selected items from the database 
async function removeItems() {
  const selectedItems = Array.from(document.querySelectorAll('#removeItemSelect input:checked'))
      .map((checkbox) => parseInt(checkbox.value));

  if (selectedItems.length === 0) {
      Swal.fire({
          icon: 'warning',
          title: 'No Items Selected',
          text: 'Please select at least one item to remove.',
          confirmButtonText: 'OK',
      });
      return;
  }

  try {
      const response = await fetch('http://localhost:5000/api/items', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedItems }),
      });

      if (response.ok) {
          Swal.fire({
              icon: 'success',
              title: 'Items Removed Successfully',
              text: 'The selected items have been removed from the inventory.',
              confirmButtonText: 'OK',
          }).then(() => showRemoveItemDropdown()); // Refresh the removal form
      } else {
          const errorData = await response.json();
          Swal.fire({
              icon: 'error',
              title: 'Failed to Remove Items',
              text: errorData.message || 'Error removing items. Please try again.',
              confirmButtonText: 'Retry',
          });
      }
  } catch (error) {
      console.error('Error removing items:', error);
      Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'There was an issue removing items. Please check your connection and try again.',
          confirmButtonText: 'Close',
      });
  }
}
// Initial call to display items
displayItems();

function handleSubmit(event) {
  // Prevent the default form submission
  event.preventDefault();
  
  // Show SweetAlert confirmation dialog before proceeding
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to add this item?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Add it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  }).then((result) => {
    // If the user clicks "Yes, Add it!"
    if (result.isConfirmed) {
      // Get the form and its data
      const form = document.getElementById('itemForm');
      const formData = new FormData(form);

      // Send the data using fetch
      fetch('http://localhost:5000/api/items', {
        method: 'POST',
        body: formData, // FormData will automatically handle file uploads
      })
      .then(response => response.json()) // Parse the JSON response
      .then(data => {
        if (data.success) {
          // Show SweetAlert on success
          Swal.fire({
            icon: 'success',
            title: 'Item Added Successfully!',
            text: data.message,
            confirmButtonText: 'OK',
          }).then(() => {
            // Redirect after SweetAlert closes
            window.location.href = '/manage-items.html'; // Redirect to orders page
            localStorage.setItem('showFormAfterRedirect', 'true'); 
          });
        } else {
          // Show SweetAlert on error
          Swal.fire({
            icon: 'error',
            title: 'Failed to Add Item',
            text: data.message || 'There was an error adding the item. Please try again.',
            confirmButtonText: 'Retry',
          });
        }
      })
      .catch(err => {
        // Handle fetch errors (e.g., network issues)
        console.error('Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'There was an issue with your request. Please check your connection and try again.',
          confirmButtonText: 'Close',
        });
      });
    }
    // If the user cancels, do nothing
    else {
      Swal.fire({
        icon: 'info',
        title: 'Action Canceled',
        text: 'Item not added.',
        confirmButtonText: 'OK',
      });
    }
  });
}

  async function showStockOutDropdown() {
    fetch('http://localhost:5000/api/items-instock')
        .then((response) => response.json())
        .then((shopItemsData) => {
            // Store the full data for filtering
            window.allItems = shopItemsData;

            const itemList = generateItemList(shopItemsData);

            cardContainer.innerHTML = `
                <div class="remove-items-container" style="background-color: #60cd12; backdrop-filter: blur(5px) brightness(0.9);">
                    <div class="header-section">
                        <h3 style="font-size:60px" class="remove-title">Stock Out Items</h3>
                        <p style="font-size:30px" class="remove-subtitle">Select items to mark as out of stock</p>
                    </div>
                    <div class="search-section">
                        <div class="search-container">
                            <input 
                                type="text" 
                                id="searchInput" 
                                class="search-input" 
                                placeholder="Search items..."
                            >
                            <i class="fas fa-search search-icon"></i>
                        </div>
                    </div>
                    <div class="items-grid">
                        <div id="removeItemSelect" class="items-wrapper">
                            ${itemList}
                        </div>
                    </div>
                    <div class="action-section">
                        <button class="stockout-button" id="StockoutButton">
                            <i class="fas fa-exclamation-circle"></i> Stock Out Selected Items
                        </button>
                    </div>
                </div>
            `;

            // Add event listeners after elements are created
            document.getElementById('StockoutButton').addEventListener('click', () => {
                Swal.fire({
                    icon: 'info',
                    title: 'Confirm Stock Out',
                    text: 'Are you sure you want to mark these items as out of stock?',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                }).then((result) => {
                    if (result.isConfirmed) {
                        stockOutItems().catch((error) => {
                            console.error('Error marking items as out of stock:', error);
                            cardContainer.innerHTML = `
                                <div class="error-message">
                                    <p>Error marking items. Please try again later.</p>
                                    <style>
                                        .error-message {
                                            text-align: center;
                                            color: #e74c3c;
                                            padding: 20px;
                                            background: #fdf0ed;
                                            border-radius: 8px;
                                            margin: 20px;
                                        }
                                    </style>
                                </div>
                            `;
                        });
                    }
                });
            });

            document.getElementById('searchInput').addEventListener('input', handleSearch);
        })
        .catch((error) => {
            console.error('Error fetching items for stock-out:', error);
            cardContainer.innerHTML = `
                <div class="error-message">
                    <p>Error loading items. Please try again later.</p>
                    <style>
                        .error-message {
                            text-align: center;
                            color: #e74c3c;
                            padding: 20px;
                            background: #fdf0ed;
                            border-radius: 8px;
                            margin: 20px;
                        }
                    </style>
                </div>
            `;
        });
}

async function stockOutItems() {
  const selectedItems = Array.from(document.querySelectorAll('#removeItemSelect input:checked'))
      .map((checkbox) => parseInt(checkbox.value));

  if (selectedItems.length === 0) {
      Swal.fire({
          icon: 'warning',
          title: 'No Items Selected',
          text: 'Please select at least one item to mark as out of stock.',
      });
      return;
  }

  try {
      const response = await fetch('http://localhost:5000/api/stock-out', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: selectedItems }),
      });

      const contentType = response.headers.get("Content-Type");

      // Check if the response is JSON
      if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json();
          if (response.ok) {
              Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: responseData.message,
              }).then(() => {
                  showStockOutDropdown();  // Refresh the list after stock-out action
              });
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: responseData.message || "Error marking items as out of stock. Please try again.",
              });
          }
      } else {
          const text = await response.text();
          console.error('Non-JSON response received:', text); // Log the error response text
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: "Error marking items. Please try again.",
          });
      }
  } catch (error) {
      console.error('Error marking items as out of stock:', error);
      Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Error marking items. Please try again.',
      });
  }
}
  async function showStockInDropdown() {
    fetch('http://localhost:5000/api/items-notinstock')
        .then((response) => response.json())
        .then((shopItemsData) => {
            // Store the full data for filtering
            window.allItems = shopItemsData;

            const itemList = generateItemList(shopItemsData);

            cardContainer.innerHTML = `
                <div class="remove-items-container" style="background-color: #60cd12; backdrop-filter: blur(5px) brightness(0.9);">
                    <div class="header-section">
                        <h3 style="font-size:60px" class="remove-title">Stock In Items</h3>
                        <p style="font-size:30px" class="remove-subtitle">Select items to add to stock</p>
                    </div>
                    <div class="search-section">
                        <div class="search-container">
                            <input 
                                type="text" 
                                id="searchInput" 
                                class="search-input" 
                                placeholder="Search items..."
                            >
                            <i class="fas fa-search search-icon"></i>
                        </div>
                    </div>
                    <div class="items-grid">
                        <div id="removeItemSelect" class="items-wrapper">
                            ${itemList}
                        </div>
                    </div>
                    <div class="action-section">
                        <button class="remove-button" id="stockInButton">
                            <i class="fas fa-arrow-up"></i> Stock In Selected Items
                        </button>
                    </div>
                </div>
            `;

            // Add event listeners after elements are created
            document.getElementById('stockInButton').addEventListener('click', () => {
                Swal.fire({
                    icon: 'info',
                    title: 'Confirm Stock In',
                    text: 'Are you sure you want to mark these items as back in stock?',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                }).then((result) => {
                    if (result.isConfirmed) {
                        stockInItems().catch((error) => {
                            console.error('Error fetching items for stock in:', error);
                            cardContainer.innerHTML = `
                                <div class="error-message">
                                    <p>Error loading items. Please try again later.</p>
                                    <style>
                                        .error-message {
                                            text-align: center;
                                            color: #e74c3c;
                                            padding: 20px;
                                            background: #fdf0ed;
                                            border-radius: 8px;
                                            margin: 20px;
                                        }
                                    </style>
                                </div>
                            `;
                        });
                    }
                });
            });

            document.getElementById('searchInput').addEventListener('input', handleSearch);
        })
        .catch((error) => {
            console.error('Error fetching items for stock in:', error);
            cardContainer.innerHTML = `
                <div class="error-message">
                    <p>Error loading items. Please try again later.</p>
                    <style>
                        .error-message {
                            text-align: center;
                            color: #e74c3c;
                            padding: 20px;
                            background: #fdf0ed;
                            border-radius: 8px;
                            margin: 20px;
                        }
                    </style>
                </div>
            `;
        });
}


async function stockInItems() {
  const selectedItems = Array.from(document.querySelectorAll('#removeItemSelect input:checked'))
      .map((checkbox) => parseInt(checkbox.value));

  if (selectedItems.length === 0) {
      Swal.fire({
          icon: 'warning',
          title: 'No Items Selected',
          text: 'Please select at least one item to mark as in stock.',
      });
      return;
  }

  try {
      const response = await fetch('http://localhost:5000/api/stock-in', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: selectedItems }),
      });

      const contentType = response.headers.get("Content-Type");

      // Check if the response is JSON
      if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json();
          if (response.ok) {
              Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: responseData.message,
              }).then(() => {
                  showStockInDropdown();  // Refresh the list after stock-in action
              });
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: responseData.message || 'Error marking items as in stock. Please try again.',
              });
          }
      } else {
          const text = await response.text();
          console.error('Non-JSON response received:', text); // Log the error response text
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error marking items. Please try again.',
          });
      }
  } catch (error) {
      console.error('Error marking items as in stock:', error);
      Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Error marking items. Please try again.',
      });
  }
}
