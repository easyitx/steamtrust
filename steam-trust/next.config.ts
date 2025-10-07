import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['steamtrust.ru', 'frontend_upstream']
    },
  },
  images: {
    domains: ["steamtrust.ru, api.steamtrust.ru, auth.steamtrust.ru", "cdn.freekassa.net"]
  }
};

export default nextConfig;
