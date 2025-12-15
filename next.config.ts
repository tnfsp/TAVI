import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 增加請求大小限制到 50MB（支援多張高解析度圖片）
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
