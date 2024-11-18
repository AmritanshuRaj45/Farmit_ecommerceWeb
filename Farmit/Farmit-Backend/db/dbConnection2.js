// dbConnection2.js
const mysql = require('mysql2/promise'); // Use the promise version

// Set up the connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'farmit',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to get a connection from the pool
const getConnection = () => pool.getConnection();

module.exports = { getConnection };
