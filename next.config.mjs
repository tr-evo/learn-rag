/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "export",
};

export default nextConfig;
