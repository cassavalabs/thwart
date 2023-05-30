/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push(
      "pino-pretty",
      "lokijs",
      "encoding",
      "utf-8-validate",
      "bufferutil"
    );
    return config;
  },
};

module.exports = nextConfig;
