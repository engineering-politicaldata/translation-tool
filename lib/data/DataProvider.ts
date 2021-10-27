import { Knex } from 'knex';

import PostgresProvider from './PostgresProvider';

export interface DataClient {
    pg: Knex;
}

export async function client(): Promise<DataClient> {
    return {
        pg: await PostgresProvider.getQueryBuilder(),
    };
}

export default { client };
