/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ]
  },
  // Добавляем настройки для разработки
  webpack: (config, { isServer }) => {
    // Добавляем поддержку source maps для отладки
    config.devtool = 'source-map';
    return config;
  },
}

module.exports = nextConfig 