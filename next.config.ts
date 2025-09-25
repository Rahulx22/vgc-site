import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["vgc.psofttechnologies.in"],
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
