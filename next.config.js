const nextConfig = {
  // Temporarily disable export for development testing
  // output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

export default nextConfig;
