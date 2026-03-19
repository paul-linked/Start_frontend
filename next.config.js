/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Backend API proxy — avoids CORS in dev
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://api.bonappit.com"}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;