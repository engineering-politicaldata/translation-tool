/* tslint:disable await-promise */
import Knex from 'knex';

export namespace Database {
    export const schema = process.env.DB_SCHEMA || 'translation';
    export const database = process.env.DB_NAME || 'vc_translation';
    export const user = process.env.DB_USER || 'postgres';
    export const password = process.env.DB_PASSWORD || 'postgres';
    export const host = process.env.DB_HOST || 'localhost';
    export const port = Number(process.env.DB_PORT || '5432');
    export const poolMin = Number(process.env.DATABASE_POOL_MIN || '0');
    export const poolMax = Number(process.env.DATABASE_POOL_MAX || '10');
    export const poolIdle = Number(process.env.DATABASE_POOL_IDLE || '10000');
}

let knex = null;

/**
 * Initialize a new Postgres provider
 */
export async function getQueryBuilder() {
    // Verify the connection before proceeding
    try {
        if (knex) {
            return knex;
        }
        // TODO How should we avoid creating builder everytime - is the following approach ok?
        knex = Knex({
            client: 'pg',
            connection: {
                user: Database.user,
                password: Database.password,
                host: Database.host,
                port: Database.port,
                database: Database.database,
            },
            pool: {
                min: Database.poolMin,
                max: Database.poolMax,
                idleTimeoutMillis: Database.poolIdle,
            },
            acquireConnectionTimeout: 2000,
            searchPath: [Database.schema],
            debug: true,
        });
        await knex.raw('SELECT now()');
        return knex;
    } catch (error) {
        throw new Error('Unable to connect to Postgres via Knex. Ensure a valid connection.');
    }
}

export default { getQueryBuilder };
