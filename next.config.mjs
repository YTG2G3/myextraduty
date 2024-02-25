/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.maxpreps.io'
      }
    ]
  }
};

export default nextConfig;
