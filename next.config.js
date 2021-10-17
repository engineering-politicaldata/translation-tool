module.exports = {
    target: 'serverless',
    env: {
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
};
