const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Servir os arquivos estáticos do build
app.use(express.static(path.join(__dirname, 'out')));

// Proxy para o frontend Next.js (se necessário, mas geralmente não precisa com exportação estática)
app.use('/app1', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
}));

// Proxy para o backend Django
app.use('/app2', createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
}));

app.listen(80, () => {
    console.log('Proxy rodando na porta 80');
});