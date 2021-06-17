module.exports = {
    target: 'serverless',
    env: {
        DB_ACCESS_KEY_ID: process.env.DB_ACCESS_KEY_ID,
        DB_SECRET_ACCESS_KEY: process.env.DB_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
        DB_TABLE_NAME: process.env.DB_TABLE_NAME,
        NEXT_PUBLIC_IMG_URL_PREFIX: process.env.NEXT_PUBLIC_IMG_URL_PREFIX,
    },
};
