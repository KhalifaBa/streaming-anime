/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "cdn.noitatnemucod.net" },
    ],
  },
};

export default nextConfig;
