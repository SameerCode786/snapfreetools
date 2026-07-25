/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["pdfjs-dist", "tesseract.js", "browser-image-compression"],
};

export default nextConfig;
