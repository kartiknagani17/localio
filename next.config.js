/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent webpack from trying to bundle these Node.js-only packages in the RSC layer
  serverExternalPackages: ['@supabase/supabase-js'],
};

module.exports = nextConfig;
