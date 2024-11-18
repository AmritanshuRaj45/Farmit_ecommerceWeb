// Import required modules
const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/dbConnection');
const verifyToken = require('../Middlewares/authMiddleware'); // Correct middleware import

// Checkout route (protected with JWT middleware)
router.post('/checkout', async (req, res) => {
    const { customerId, totalAmount, items, address } = req.body;


    let connection;
    try {
        // Establish a database connection
        connection = await getConnection();
    

        // Begin transaction
        await connection.beginTransaction();
  

        // Insert the order into the orders table, now including the address
        const orderQuery = `INSERT INTO orders (customer_id, total_amount, address) VALUES (?, ?, ?)`;


        const orderResult = await connection.query(orderQuery, [customerId, totalAmount, address]);

        // Check if the order was inserted
        const affectedRows = orderResult.count;

        if (affectedRows > 0) {


            // Retrieve the last inserted order ID manually
            const lastInsertIdQuery = `SELECT LAST_INSERT_ID() AS orderId`;
            const lastInsertIdResult = await connection.query(lastInsertIdQuery);


            // Check if the result contains data
            if (lastInsertIdResult && lastInsertIdResult[0] && lastInsertIdResult[0].orderId) {
                const orderId = lastInsertIdResult[0].orderId; // orderId is a BigInt
       

                // Convert BigInt to String for serialization
                const orderIdString = orderId.toString();

                // Insert each item into the order_items table
                for (const item of items) {
                    const itemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price, product_name, category) VALUES (?, ?, ?, ?, ?, ?)`;
                    await connection.query(itemQuery, [
                        orderIdString,
                        item.productId,
                        item.quantity,
                        item.price,
                        item.product_name,
                        item.description    // Ensure this matches the property in the items array
                    ]);
                }

                // Commit transaction if everything succeeded
                await connection.commit();
                res.status(201).json({ message: 'Order placed successfully!', orderId: orderIdString }); // Send orderId as a string
            } else {
                throw new Error('Failed to retrieve last inserted order ID.');
            }
        } else {
            throw new Error('Failed to insert order.');
        }
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order', error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

module.exports = router;
