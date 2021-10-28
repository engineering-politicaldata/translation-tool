const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    env: {
        DB_SCHEMA: process.env.DB_SCHEMA,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DATABASE_POOL_MIN: process.env.DATABASE_POOL_MIN,
        DATABASE_POOL_MAX: process.env.DATABASE_POOL_MAX,
        DATABASE_POOL_IDLE: process.env.DATABASE_POOL_IDLE,
        JWT_SECRET: process.env.JWT_SECRET,
        NEXT_PUBLIC_IMG_URL_PREFIX: process.env.NEXT_PUBLIC_IMG_URL_PREFIX,
    },
    async redirects() {
        return [
            {
                source: '/auth',
                destination: '/auth/sign-up',
                permanent: true,
            },
        ];
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (!isServer) {
            config.node = {
                fs: 'empty',
            };
        }
        return config;
    },
});
