const express = require('express');
const path = require('path');

const app = express();

// Parse JSON bodies
app.use(express.json());

// Serve static files with proper MIME types
app.use(
  express.static(__dirname, {
    setHeaders: (res, filePath) => {
      // Set proper MIME types for different file extensions
      const ext = path.extname(filePath).toLowerCase();
      switch (ext) {
        case '.css':
          res.setHeader('Content-Type', 'text/css');
          break;
        case '.js':
          res.setHeader('Content-Type', 'application/javascript');
          break;
        case '.html':
          res.setHeader('Content-Type', 'text/html');
          break;
        case '.json':
          res.setHeader('Content-Type', 'application/json');
          break;
      }
    },
  })
);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Server Error',
    error: err.message,
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Client server running at http://localhost:${PORT}`);
});
