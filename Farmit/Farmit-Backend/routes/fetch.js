const express = require('express');

const router = express.Router();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path'); // Import path module
const { getConnection } = require('../db/dbConnection2'); // Ensure this path is correct

router.get('/feedback', async (req, res) => {
  let connection;
  
  try {
    // Get a connection from the pool
    connection = await getConnection();

    // Fetch all contact submissions from the database
    const [results] = await connection.query('SELECT * FROM contacts ORDER BY submitted_at DESC');

    // Send the contact data as JSON
    res.status(200).json(results);
  } catch (err) {
    // Handle any errors and send an error message
    console.error('Error fetching contact data:', err.message || err);
    res.status(500).json({ message: 'Failed to fetch contact data', error: err.message });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});
// Route to fetch subscription data
router.get('/subscriptions', async (req, res) => {
    let connection;
    
    try {
      // Get a connection from the pool
      connection = await getConnection();
  
      // Query to fetch all subscriptions from the database
      const [results] = await connection.query('SELECT * FROM subscription ORDER BY subscribed_at DESC');
  
      // Send the subscription data as JSON
      res.status(200).json(results);
    } catch (err) {
      // Handle any errors and send an error message
      console.error('Error fetching subscription data:', err.message || err);
      res.status(500).json({ message: 'Failed to fetch subscription data', error: err.message });
    } finally {
      // Release the connection back to the pool
      if (connection) {
        connection.release();
      }
    }
  });
  // Route to fetch customers with their total orders
router.get('/customers', async (req, res) => {
  let connection;

  try {
      // Get a connection from the pool
      connection = await getConnection();

      // SQL query to fetch customer details and count their orders
      const query = `
          SELECT 
              u.id,
              u.name,
              u.email,
              u.phone,
              u.city,
              COUNT(o.order_id) AS total_orders
          FROM 
              users u
          LEFT JOIN 
              orders o ON u.id = o.customer_id
          WHERE 
              u.role = 'customer'
          GROUP BY 
              u.id, u.name, u.email, u.phone, u.city
          ORDER BY 
              u.id;
      `;

      // Execute the query
      const [results] = await connection.query(query);

      // Send the customer data as JSON
      res.status(200).json(results);
  } catch (err) {
      // Handle any errors and send an error message
      console.error('Error fetching customer data:', err.message || err);
      res.status(500).json({ message: 'Failed to fetch customer data', error: err.message });
  } finally {
      // Release the connection back to the pool
      if (connection) {
          connection.release();
      }
  }
});
// Route to fetch all orders with order items
router.get('/orders', async (req, res) => {
  let connection;
  try {
      // Get a connection from the pool
      connection = await getConnection();

      // Query to fetch order details along with order items
      const query = `
          SELECT 
              o.order_id, o.order_date, o.total_amount,o.address, u.name AS customer_name,
              oi.product_id, oi.product_name, oi.category, oi.quantity, oi.price
          FROM 
              orders o
          JOIN 
              users u ON o.customer_id = u.id
          JOIN 
              order_items oi ON oi.order_id = o.order_id
          ORDER BY 
              o.order_id DESC;
      `;
      const [orders] = await connection.query(query);
      

      // Transform data into a nested structure using an array to maintain order
      const orderData = [];
      let currentOrderId = null;
      let currentOrder = null;

      orders.forEach(order => {
          if (currentOrderId !== order.order_id) {
              // Create a new order entry
              currentOrder = {
                  order_id: order.order_id,
                  order_date: order.order_date,
                  total_amount: order.total_amount,
                  customer_name: order.customer_name,
                  address: order.address,
                  items: []
              };
              orderData.push(currentOrder);
              currentOrderId = order.order_id;
          }
          // Add item to the current order
          currentOrder.items.push({
              product_id: order.product_id,
              product_name: order.product_name,
              category: order.category,
              quantity: order.quantity,
              price: order.price,
              subtotal: order.price * order.quantity
          });
      });

      // Send the ordered data as JSON
      res.status(200).json(orderData);
  } catch (err) {
      // Handle any errors and send an error message
      console.error('Error fetching order data:', err.message || err);
      res.status(500).json({ message: 'Failed to fetch order data', error: err.message });
  } finally {
      // Release the connection back to the pool
      if (connection) {
          connection.release();
      }
  }
});
router.get('/items', async (req, res) => {
  let connection;

  try {
    // Get a connection from the pool
    connection = await getConnection();

    // Query to fetch all items from the database
    const [results] = await connection.query('SELECT id, name, price, description AS `desc`, img,in_stock FROM items');

    // Send the items data as JSON
    res.status(200).json(results);
  } catch (err) {
    // Handle any errors and send an error message
    console.error('Error fetching items data:', err.message || err);
    res.status(500).json({ message: 'Failed to fetch items data', error: err.message });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});
// Middleware for handling file uploads
router.use(fileUpload());

// POST route to add a new item with image upload
router.post('/items', async (req, res) => {
  const { name, price, desc } = req.body;
  const file = req.files ? req.files.itemImage : null;

  // Validate file and fields
  if (!file || !name || !price || !desc) {
    return res.status(400).json({ message: 'Missing required fields or file' });
  }

  const uploadDir = path.join(__dirname, '..', '..', 'Farmit-Frontend', 'images'); // Absolute path

  const extname = path.extname(file.name);
  const basename = path.basename(file.name, extname);
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

  if (!allowedExtensions.includes(extname.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid file extension. Only .jpg, .jpeg, .png, .gif are allowed.' });
  }

   // Modify the file name by appending a random number between 100 and 999 to the original name
   const randomizedName = `${basename}-${Math.floor(100 + Math.random() * 900)}${extname}`;
   const savePath = path.join(uploadDir, randomizedName);
  file.mv(savePath, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to upload file', error: err.message });
    }

    const imgPath = `/images/${randomizedName}`;

    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.query(
        'INSERT INTO items (name, price, description, img) VALUES (?, ?, ?, ?)',
        [name, price, desc, imgPath]
      );
      res.json({ success: true, message: 'Item added successfully!' });

    } catch (err) {
      console.error('Error adding item:', err.message || err);
      res.status(500).json({ message: 'Failed to add item', error: err.message });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  });
});

// DELETE route to remove selected items and their corresponding images
router.delete('/items', async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No items selected for removal' });
    }

    // Fetch the image paths for the items to be deleted
    const [items] = await connection.query(
      `SELECT img FROM items WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    );

    // Delete each image file
    items.forEach(item => {
      const imagePath = path.join(__dirname, '..', '..', 'Farmit-Frontend', item.img);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image file ${imagePath}:`, err.message);
        }
      });
    });

    // Delete items from the database
    const [result] = await connection.query(
      `DELETE FROM items WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    );

    res.json({ success: true, message: 'Selected items and their images removed successfully!' });
  } catch (err) {
    console.error('Error removing items:', err.message || err);
    res.status(500).json({ message: 'Failed to remove items', error: err.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.get('/items-instock', async (req, res) => {
  let connection;

  try {
    // Get a connection from the pool
    connection = await getConnection();

    // Query to fetch all items from the database
    const [results] = await connection.query('SELECT id, name, price, description AS `desc`, img,in_stock FROM items where in_stock=true');

    // Send the items data as JSON
    res.status(200).json(results);
  } catch (err) {
    // Handle any errors and send an error message
    console.error('Error fetching items data:', err.message || err);
    res.status(500).json({ message: 'Failed to fetch items data', error: err.message });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});
router.get('/items-notinstock', async (req, res) => {
  let connection;

  try {
    // Get a connection from the pool
    connection = await getConnection();

    // Query to fetch all items from the database
    const [results] = await connection.query('SELECT id, name, price, description AS `desc`, img,in_stock FROM items where in_stock=false');

    // Send the items data as JSON
    res.status(200).json(results);
  } catch (err) {
    // Handle any errors and send an error message
    console.error('Error fetching items data:', err.message || err);
    res.status(500).json({ message: 'Failed to fetch items data', error: err.message });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});
router.post('/stock-out', async (req, res) => {
  let connection;

  try {

    
    connection = await getConnection();

    const { ids } = req.body;


    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No items selected for stock-out' });
    }

    // Build placeholders for the query
    const placeholders = ids.map(() => '?').join(',');

    const [result] = await connection.query(
      `UPDATE items SET in_stock = FALSE WHERE id IN (${placeholders})`,
      ids
    );


    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Selected items marked as out of stock successfully!' });
    } else {
      res.status(404).json({ success: false, message: 'No items were updated. Please check the item IDs.' });
    }
  } catch (err) {
    console.error('Error updating stock status:', err.message || err);
    res.status(500).json({ message: 'Failed to update stock status', error: err.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
router.post('/stock-in', async (req, res) => {
  let connection;

  try {

    
    connection = await getConnection();

    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No items selected for stock-in' });
    }

    // Build placeholders for the query
    const placeholders = ids.map(() => '?').join(',');

    const [result] = await connection.query(
      `UPDATE items SET in_stock = TRUE WHERE id IN (${placeholders})`,
      ids
    );

  

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Selected items marked as in stock successfully!' });
    } else {
      res.status(404).json({ success: false, message: 'No items were updated. Please check the item IDs.' });
    }
  } catch (err) {
    console.error('Error updating stock status:', err.message || err);
    res.status(500).json({ message: 'Failed to update stock status', error: err.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});


module.exports = router;
