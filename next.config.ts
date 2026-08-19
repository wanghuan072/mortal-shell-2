import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "mortalshelldb.com" }],
  },
  async redirects() {
    return [
      { source: "/wiki/shells", destination: "/shells", permanent: true },
      { source: "/wiki/shells/:path+", destination: "/shells/:path+", permanent: true },
      { source: "/wiki/weapons", destination: "/weapons", permanent: true },
      { source: "/wiki/weapons/:path+", destination: "/weapons/:path+", permanent: true },
    ];
  },
};

export default nextConfig;
