/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'myed.s3.amazonaws.com'
      }
    ]
  },
  compiler: {
    styledComponents: true
  }
};

export default nextConfig;
