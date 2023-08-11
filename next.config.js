/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/a/**"
            }
        ]
    },
    output: "export"
}

module.exports = nextConfig