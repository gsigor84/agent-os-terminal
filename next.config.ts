import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5001/demo-project/us-central1/api',
      },
    ];
  },
};

export default nextConfig;
