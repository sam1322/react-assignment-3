/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "unsplash.com",
          // port: '',
          // pathname: '/account123/**',
        },
        {
          protocol: "https",
          hostname: "picsum.photos",
          // port: '',
          // pathname: '/account123/**',
        },
        {
          protocol: "https",
          hostname: "www.themealdb.com",
          // port: '',
          // pathname: '/account123/**',
        },
        
      ],
    },
};

export default nextConfig;
