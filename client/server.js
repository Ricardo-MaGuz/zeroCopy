const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Server Error',
    error: err.message,
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Client server running at http://localhost:${PORT}`);
});
