/* eslint-disable @typescript-eslint/no-require-imports -- Next.js plugin 패턴 */
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // env 블록 제거 - Next.js가 .env.local을 자동으로 로드하도록 함
};

module.exports = withBundleAnalyzer(nextConfig);
