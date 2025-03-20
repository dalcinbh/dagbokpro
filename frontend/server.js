const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();

  server.use(
    '/app2',
    createProxyMiddleware({
      target: 'http://192.168.1.2:8000',
      changeOrigin: true,
      pathRewrite: { '^/app2': '' },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying to backend:', req.url);
      },
    })
  );

  server.all('/app1*', (req, res) => {
    console.log('Handling frontend request:', req.url);
    console.log('Original URL:', req.originalUrl);
    console.log('Host:', req.headers.host);
    req.url = req.url.replace(/^\/app1/, '');
    return handle(req, res);
  });

  server.all('*', (req, res) => {
    console.log('Catch-all request:', req.url);
    return handle(req, res);
  });

  server.listen(3000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> Server rodando em http://192.168.1.2:3000');
  });
});