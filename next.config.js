/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent webpack from bundling this in the RSC layer (fixes 500 in /api/publish)
  // serverExternalPackages is the correct key in Next.js 14.2.x
  serverExternalPackages: ['@supabase/supabase-js'],
};

module.exports = nextConfig;
