/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "4ynfpbck9li3qlrs.public.blob.vercel-storage.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ek65wlrwd0szvdez.public.blob.vercel-storage.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "zns-metadata.s3.eu-north-1.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cryptologos.cc",
        port: "",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
      },
    ],
  },
  // Performance optimizations
  webpack: (config, { isServer }) => {
    // Exclude heavy Node.js modules from client bundle
    if (!isServer) {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
    }
    // Reduce module resolution time
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      // Suppress Web3 library warnings
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };
    return config;
  },
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  // Experimental features for faster builds
  experimental: {
    optimizePackageImports: ['@lifi/widget', 'wagmi', 'viem'],
  },
};
export default nextConfig;
