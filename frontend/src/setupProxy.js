// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  app.use(
    createProxyMiddleware('/admin', {
      target: 'http://localhost:8000',
      changeOrigin: true,
      ws: true,
    }),
  );
};
