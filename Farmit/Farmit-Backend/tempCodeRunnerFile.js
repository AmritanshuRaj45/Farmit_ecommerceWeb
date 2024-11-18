
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