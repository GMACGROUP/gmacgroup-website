/** @type {import('next').NextConfig} */

// Hosts allowed to serve optimised images (team portraits etc.)
const remotePatterns = [
  { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
  { protocol: "http", hostname: "localhost", port: "8000", pathname: "/api/v1/uploads/media/**" },
];
if (process.env.NEXT_PUBLIC_API_URL) {
  try {
    const u = new URL(process.env.NEXT_PUBLIC_API_URL);
    remotePatterns.push({ protocol: u.protocol.replace(":", ""), hostname: u.hostname, pathname: "/api/v1/uploads/media/**" });
  } catch {}
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/services", destination: "/expertise", permanent: true },
      { source: "/opportunities", destination: "/careers", permanent: true },
      { source: "/insights", destination: "/research", permanent: true },
    ];
  },
};

module.exports = nextConfig;
