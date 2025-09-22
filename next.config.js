const nextConfig = {
  // Temporairement désactiver l'export pour les tests de développement
  // output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

export default nextConfig;
