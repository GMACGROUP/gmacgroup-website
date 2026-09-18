/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TODO: configure image domains (Supabase storage, CMS, etc.)
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
