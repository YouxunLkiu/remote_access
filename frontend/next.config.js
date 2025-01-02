// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*', // This matches any request starting with /api/
          destination: 'http://localhost:4000/:path*', // Proxy to the backend
        },
      ];
    },
  };
  