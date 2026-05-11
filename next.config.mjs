/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Since we are migrating from a Vite project with many static HTML files,
  // we might want to handle some rewrites or redirects here eventually.
};

export default nextConfig;
