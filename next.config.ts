import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/member/vehicles",
        destination: "/member/garage",
        permanent: true,
      },
      {
        source: "/member/vehicles/:id",
        destination: "/member/garage/:id",
        permanent: true,
      },
    ];
  },
  // Allow LAN access in dev (fonts, HMR, etc.) — Next.js 16 blocks these by default.
  allowedDevOrigins: ["192.168.0.178"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "toybox-staging-media.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
