
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    console.log('Inside proxy')
    // throw new Error("asasdasdasdasdasd")
    app.use(
        createProxyMiddleware('/api', {
            target: process.env.REACT_APP_HOST_BACKEND,
            secure: false,
            changeOrigin: true,
        }),
    );
};
