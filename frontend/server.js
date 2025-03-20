const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Serve static files from the 'out' directory
app.use(express.static(path.join(__dirname, 'out')));

// Proxy for the Django backend
app.use('/app2', createProxyMiddleware({
  target: 'http://localhost:8000', // Point to the Django backend
  changeOrigin: true,
  pathRewrite: {
    '^/app2': '', // Remove the `/app2` prefix when forwarding to the backend
  },
}));

// Handle any other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

// Start the server
app.listen(80, () => {
  console.log('Proxy server running on port 80');
  console.log('Serving static files from:', path.join(__dirname, 'out'));
});