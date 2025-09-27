import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vgc.psofttechnologies.in",
        pathname: "/storage/builder/**",
      },
    ],
  },
};

export default nextConfig;
