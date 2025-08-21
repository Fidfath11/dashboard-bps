/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // assetPrefix: ".",

  // PERUBAHAN: Tambahkan konfigurasi webpack di sini
  webpack: (config, { isServer }) => {
    // Ini memastikan modul server-side tidak masuk ke dalam bundle client-side
    // Jika bukan di server (artinya di browser), berikan fallback kosong untuk modul 'fs'
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;