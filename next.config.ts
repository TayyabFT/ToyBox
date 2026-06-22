import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Allow LAN access in dev (fonts, HMR, etc.) — Next.js 16 blocks these by default.
  allowedDevOrigins: ["192.168.0.178"],
};

export default nextConfig;
