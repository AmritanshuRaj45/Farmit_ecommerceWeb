const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/dbConnection2'); // Use the correct path to your dbConnection2.js

// POST route for email subscription
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    let connection;

    try {
        // Basic validation to check if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Establish database connection
        connection = await getConnection();

        // Check if the email already exists in the database
        const checkQuery = 'SELECT COUNT(*) AS count FROM subscription WHERE email = ?';
        const [rows] = await connection.query(checkQuery, [email]);


        // Ensure we handle the case properly for BigInt
        const count = rows[0].count ? rows[0].count.toString() : '0'; // Convert BigInt to string


        if (parseInt(count) > 0) {
            // If email already exists, return a response indicating it's already subscribed
            return res.status(409).json({ message: 'Email is already subscribed' });
        }

        // Insert email into the subscription table if it does not exist
        const insertQuery = 'INSERT INTO subscription (email) VALUES (?)';


        await connection.query(insertQuery, [email]);


        res.status(201).json({ message: 'Subscribed successfully!' });
    } catch (error) {
        console.error('Error saving subscription:', error.message || error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        // Close the database connection
        if (connection) {
            connection.release(); // Use release instead of close since it's a connection pool
          
        }
    }
});

module.exports = router;
