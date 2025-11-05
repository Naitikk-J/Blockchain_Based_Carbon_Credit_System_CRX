import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    allowedDevOrigins: [
      "3000-firebase-crx2ogit-1762331035579.cluster-cd3bsnf6r5bemwki2bxljme5as.cloudworkstations.dev",
    ],
  },
};

export default nextConfig;
