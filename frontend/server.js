const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Rota para /app1 (porta 3000)
app.use('/app1', createProxyMiddleware({
    target: 'http://dagbok:3000',
    changeOrigin: true,
}));

// Rota para /app2 (porta 8000)
app.use('/app2', createProxyMiddleware({
    target: 'http://dagbok:8000',
    changeOrigin: true,
}));

app.listen(80, () => {
    console.log('Proxy rodando na porta 80');
});