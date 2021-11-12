// Update with your config settings.
module.exports = async () => {
    const schema = process.env.DB_SCHEMA || 'translation';
    return {
        client: 'pg',
        connection: {
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'translationtool',
        },
        // searchPath: [schema],
        migrations: {
            tableName: 'knex_migrations',
            directory: 'lib/migrations',
        },
        seeds: {
            directory: 'lib/seeds',
        },
    };
};
