const customerId = sessionStorage.getItem('customerId');
if (sessionStorage.getItem('isAdminLoggedIn_' + customerId) === 'true') {
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
        fetchOrderData();
    };
    };
    function fetchOrderData() {
    fetch('/api/orders?' + new Date().getTime(), {  // prevent caching
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token_' + customerId)}`,  // Add token in the Authorization header
        }
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    alert('You are not authorized. Please log in!');
                    window.location.href = '/index'; // Redirect to login if unauthorized
                    return;
                }

                throw new Error('Failed to fetch order data. Please try again later.');
            }

            return response.json();
        })
        .then(data => {
            const ordersContainer = document.getElementById('orders-container');
            ordersContainer.innerHTML = ''; // Clear previous content

            data.forEach(order => {
                const orderDate = new Date(order.order_date);
                const orderDateFormatted = orderDate.toLocaleDateString();  // Format the date
                const orderTimeFormatted = orderDate.toLocaleTimeString();  // Format the time

                const orderCard = document.createElement('div');
                orderCard.classList.add('order-card');

                const orderSummary = `
                    <h2 style="color: #4CAF50;">Order #${order.order_id}</h2>
                    <p><strong>Customer Name:</strong> ${order.customer_name}</p>
                    <p><strong>Address:</strong> ${order.address}</p>  <!-- Display address here -->
                    <p><strong>Order Date:</strong> ${orderDateFormatted}</p>
                    <p><strong>Order Time:</strong> ${orderTimeFormatted}</p>
                    <p><strong>Total Amount:</strong> ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(order.total_amount))}</p>
                `;
                orderCard.innerHTML = orderSummary;

                const table = document.createElement('table');
                table.classList.add('order-items-table', 'table', 'table-bordered', 'table-striped', 'table-hover', 'order-table');

                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price per Item</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => {
                            // Convert item.price to a number and check if it's a valid number
                            const price = isNaN(parseFloat(item.price)) ? 0 : parseFloat(item.price);
                            const subtotal = isNaN(parseFloat(item.subtotal)) ? 0 : parseFloat(item.subtotal);
                            return `
                                <tr>
                                    <td>${item.product_id}</td>
                                    <td>${item.product_name}</td>
                                    <td>${item.category}</td>
                                    <td>${item.quantity}</td>
                                    <td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price)}</td>
                                    <td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(subtotal)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                `;
                orderCard.appendChild(table);

                ordersContainer.appendChild(orderCard);
            });

            const exportBtn = document.getElementById('exportExcBtn');
            exportBtn.addEventListener('click', function () {
                exportToExcel(data);
            });
        })
        .catch(error => {
            console.error('Error fetching order data:', error);
        });

    }
function exportToExcel(data) {
    // Create an array to hold the headers and rows
    const rows = [];
    const headers = [
        'Order ID', 'Customer Name', 'Order Date', 'Order Time', 'Total Amount (INR)','Address',
        'Product ID', 'Product Name', 'Category', 'Quantity', 'Price per Item (INR)', 'Subtotal (INR)'
    ];
    
    // Push headers as the first row
    rows.push(headers);

    // Loop through the data and add rows
    data.forEach(order => {
        const orderDate = new Date(order.order_date);
        const orderTime = orderDate.toLocaleTimeString();
        const orderDateFormatted = orderDate.toLocaleDateString();
        
        order.items.forEach(item => {
            rows.push([
                order.order_id,
                order.customer_name,
                orderDateFormatted,
                orderTime,
                parseFloat(order.total_amount),  // Store as a float (no INR symbol)
                order.address,
                item.product_id,
                item.product_name,
                item.category,
                item.quantity,
                parseFloat(item.price),  // Store as a float (no INR symbol)
                parseFloat(item.subtotal)  // Store as a float (no INR symbol)
            ]);
        });
    });

    // Create a new worksheet
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Export the workbook to an XLSX file
    XLSX.writeFile(wb, 'customer_orders.xlsx');
}
