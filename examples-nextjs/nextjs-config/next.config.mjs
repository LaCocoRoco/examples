import config from 'config';

const nextConfig = {
  reactStrictMode: true,
  env: config.util.toObject()
}

export default nextConfig;
