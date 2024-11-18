const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/dbConnection'); // Import the getConnection function
const verifyToken = require('../Middlewares/authMiddleware');

// POST route for contact submissions
router.post('/contact',  async (req, res) => {
    const { name, email, address, phone, message } = req.body;

    let connection;

    try {
        // Check if all required fields are provided
        if (!name || !email || !address || !phone || !message) {
            console.warn('Missing required fields:', { name, email, address, phone, message });
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Establish a database connection
        connection = await getConnection();


        // Begin transaction
        await connection.beginTransaction();


        // Insert the contact data into the database
        const contact_query = 'INSERT INTO contacts (name, email, address, phone, message) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.query(contact_query, [name, email, address, phone, message]);


        // Commit transaction if everything succeeded
        await connection.commit();

        res.status(201).json({ message: 'Contact information saved successfully' });
    } catch (error) {
        // Roll back transaction in case of an error
        if (connection) await connection.rollback();
        console.error('Error saving contact data:', error.message || error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        // Close the database connection
        if (connection) {
            await connection.close();
        }
    }
});

module.exports = router;
