/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/LK',
  assetPrefix: '/LK',

  // Performance optimizations
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
    SWC_CACHE: "1",
    WEBPACK_CACHE: "memory",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,

  // --- ВАЖНЫЕ ПРАВКИ ДЛЯ ОБЛАКА ---
  experimental: {
    // Разрешаем домен GigaIDE для обхода ошибок Cross-Origin
    allowedDevOrigins: [
      'gigaide-0e22c254-4f36-47fb-9636-7fa6b84aba21-65535.containerapps.ru'
    ],
  },
  devIndicators: {
    appIsrStatus: false, // Отключаем индикаторы, которые могут тормозить прокси
  },
  // -------------------------------

  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      encoding: false,
    };
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    };
    return config;
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;