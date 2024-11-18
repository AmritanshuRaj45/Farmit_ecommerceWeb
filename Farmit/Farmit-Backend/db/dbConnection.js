// db/dbConnection.js
const odbc = require('odbc');
require('dotenv').config();

const connectionString = process.env.ODBC_DSN;

async function getConnection() {
  try {
    const connection = await odbc.connect(connectionString);
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

module.exports = { getConnection };
