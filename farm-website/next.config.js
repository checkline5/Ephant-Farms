/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",       // Important for static export
  images: { unoptimized: true }, // Optional for simple hosting
};

module.exports = nextConfig;