import path from "node:path";
import { fileURLToPath } from "node:url";

const nextjsRoot = path.dirname(fileURLToPath(import.meta.url));
const isElectronBuild = process.env.PRESENTON_ELECTRON_BUILD === "true";

const nextConfig = {
  reactStrictMode: false,
  distDir: ".next-build",
  output: "standalone",
  turbopack: {
    root: nextjsRoot,
  },
  ...(process.env.NODE_ENV !== "production"
    ? {
        allowedDevOrigins: [
          "127.0.0.1",
          "localhost",
          "192.168.213.1",
          "0.0.0.0",
        ],
      }
    : {}),

  async rewrites() {
    const fastApiUrl =
      process.env.FAST_API_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_FAST_API ||
      "http://127.0.0.1:5001";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${fastApiUrl}/api/v1/:path*`,
      },
      {
        source: "/api/v2/:path*",
        destination: `${fastApiUrl}/api/v2/:path*`,
      },
      {
        source: "/app_data/:path*",
        destination: `${fastApiUrl}/app_data/:path*`,
      },
      {
        source: "/static/:path*",
        destination: `${fastApiUrl}/static/:path*`,
      },
    ];
  },

  images: {
    // A packaged Electron app is installed under a read-only directory such as
    // /opt/Presenton. Next's optimizer writes to <distDir>/cache, so emit direct
    // image URLs for that build instead of attempting runtime cache writes.
    unoptimized: isElectronBuild,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-7c765f3726084c52bcd5d180d51f1255.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pptgen-public.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pptgen-public.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "present-for-me.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "yefhrkuqbjcblofdcpnr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
  
};

export default nextConfig;
