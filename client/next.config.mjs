const nextConfig = {
  webpack: (config) => {
    return {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 300
      }
    };
  }
};

export default nextConfig;