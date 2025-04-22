/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: false,
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "storeapi.elelanmarket.com",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "storeapi.elelanmarket.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
    domains: ["storeapi.elelanmarket.com"],
  },
};

export default nextConfig;
