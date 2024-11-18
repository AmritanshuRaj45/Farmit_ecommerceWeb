const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const connectDB = require('../db/dbConnection');
const path = require('path');
const router = express.Router();
const verifyToken = require('../Middlewares/authMiddleware'); // Correct middleware import

// Secret key for JWT (should be stored securely, like in .env)
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-very-secure-secret-key';


// Using Map to store active sessions with TTL functionality
class SessionStore {
    constructor() {
        this.sessions = new Map();
        setInterval(() => this.cleanExpiredSessions(), 5 * 60 * 1000);
    }

    set(customerId, sessionData) {
        this.sessions.set(customerId.toString(), {
            ...sessionData,
            timestamp: Date.now()
        });
    }

    get(customerId) {
        const session = this.sessions.get(customerId.toString());
        if (!session) {
            return null;
        }
        
        if (Date.now() - session.timestamp > 3600000) {
            this.delete(customerId);
            return null;
        }
        return session;
    }

    delete(customerId) {
        return this.sessions.delete(customerId.toString());
    }

    cleanExpiredSessions() {
        const now = Date.now();
        for (const [customerId, session] of this.sessions.entries()) {
            if (now - session.timestamp > 3600000) {
                this.delete(customerId);
            }
        }
    }
}

const activeSessionStore = new SessionStore();

router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    let connection;

    try {
        connection = await connectDB.getConnection();

        const query = `SELECT id AS customerId, username, password, role FROM users WHERE BINARY username = ? AND BINARY password = ? AND BINARY role = ?`;
        const [user] = await connection.query(query, [username, password, role]);

        if (!user) {
            return res.status(401).send('Invalid username, password, or role.');
        }

        const token = jwt.sign(
            { customerId: user.customerId, username: user.username, role: user.role },
            JWT_SECRET_KEY,
            { expiresIn: '30m' }
        );

        const customerId = user.customerId.toString();
        const existingSession = activeSessionStore.get(customerId);

        if (existingSession) {
            return res.json({
                message: 'You are already logged in from another device/tab. Do you want to proceed and log out the other session?',
                proceed: false,
                token,
                customerId: customerId,
                username: user.username,
                redirectUrl: role === 'customer' ? '/home.html' : '/admin-dashboard.html'
            });
        }

        activeSessionStore.set(customerId, {
            token,
            role,
            username: user.username
        });

        res.json({
            token,
            customerId: customerId,
            username: user.username,
            redirectUrl: role === 'customer' ? '/home.html' : '/admin-dashboard.html',
            proceed: true
        });

    } catch (error) {
        res.status(500).send('Server error. Please try again later.');
    } finally {
        if (connection) await connection.close();
    }
});

router.post('/logout', (req, res) => {
    const { customerId } = req.body;
    
    if (!customerId) {
        return res.status(400).json({ message: 'CustomerId is required' });
    }

    try {
        const strCustomerId = customerId.toString();
        const wasDeleted = activeSessionStore.delete(strCustomerId);
        
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({ message: 'Could not log out, please try again.' });
                }
            });
        }
        
        res.json({ 
            message: wasDeleted ? 'Successfully logged out.' : 'No active session found.',
            sessionCleared: wasDeleted
        });
    } catch (error) {
        res.status(500).json({ message: 'Could not log out, please try again.' });
    }
});

// Registration Route
router.post('/register', async (req, res) => {
    const { name, username, password, email, phone, city, role } = req.body;
    let connection;

    try {
        connection = await connectDB.getConnection();

        // Check if username already exists
        const existingUserQuery = `SELECT * FROM users WHERE username = ?`;
        const [existingUser] = await connection.query(existingUserQuery, [username]);

        if (existingUser) {
            return res.status(400).send('Username already exists. Please choose another one.');
        }

        // Insert new user
        const insertQuery = `INSERT INTO users (name, username, password, email, phone, city, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await connection.query(insertQuery, [name, username, password, email, phone, city, role]);

        res.redirect('/success.html');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error. Please try again later.');
    } finally {
        if (connection) await connection.close();
    }
});
router.delete('/deleteAccount',  async (req, res) => {
    const customerId = req.body.customerId;
    console.log(customerId);

    if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    let connection;
    try {
        connection = await connectDB.getConnection();
        const deleteQuery = `DELETE FROM users WHERE id = ?`;
        await connection.query(deleteQuery, [customerId]);
        // Clear session and active session store after account deletion
        activeSessionStore.delete(customerId);
        if (req.session) req.session.destroy();

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    } finally {
        if (connection) await connection.close();
    }
});


// Protected route for customer home page
router.get('/home.html',verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../../Farmit-Frontend/home.html')); // Serve the customer home page
});

// Protected route for admin dashboard
router.get('/admin-dashboard.html',verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../../Farmit-Frontend/admin-dashboard.html')); // Serve the admin dashboard
});

module.exports = router;
