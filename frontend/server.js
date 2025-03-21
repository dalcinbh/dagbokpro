// frontend/server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();

  // Proxy para o Django: /django/* -> http://localhost:8000
  server.use(
    '/django',
    createProxyMiddleware({
      target: 'http://localhost:8000', // Backend Django local
      changeOrigin: true,
      pathRewrite: { '^/django': '' }, // Remove o prefixo /django
    })
  );

  // Todas as outras rotas -> Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> Server rodando em http://localhost:3000');
  });
});