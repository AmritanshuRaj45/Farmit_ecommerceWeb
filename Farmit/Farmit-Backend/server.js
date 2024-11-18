const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

require('dotenv').config(); // Load environment variables

const sessionSecret = process.env.SESSION_SECRET || 'default-secret-key'; // Fallback if not set in .env
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Import routes
const authRoutes = require('./routes/auth');
const checkoutRoutes = require('./routes/checkout');
const contactRoutes = require('./routes/contact');
const subscribeRoute = require('./routes/subscribe');
const fetchRoutes = require('./routes/fetch');

// JWT Middleware to protect routes
const verifyToken = require('./Middlewares/authMiddleware'); // Import the JWT middleware


// Middleware to prevent caching for authenticated pages (session-based)
app.use((req, res, next) => {
    if (req.session.user) {
        res.setHeader('Cache-Control', 'no-store');
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Farmit-Frontend/index.html'));
});
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../Farmit-Frontend/index.html'));
});

// Static file serving for frontend assets
app.use(express.static(path.join(__dirname, '../Farmit-Frontend')));
app.get('/home',verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../Farmit-Frontend/home.html'));
});
app.get('/admin-dashboard',verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../Farmit-Frontend/admin-dashboard.html'));
});



// Public API Routes (no authentication required)
app.use('/api', checkoutRoutes);
app.use('/api', contactRoutes);
app.use('/api', subscribeRoute);
app.use('/api', fetchRoutes);
app.use('/api/auth', authRoutes); 



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
