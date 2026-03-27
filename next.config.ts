import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow data: URLs for base64-encoded product images
    dangerouslyAllowSVG: true,
  },
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
