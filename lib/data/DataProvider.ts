import { getQueryBuilder } from '@database';
import { Knex } from 'knex';

export interface DataClient {
    pg: Knex;
}

export async function getClient(): Promise<DataClient> {
    return {
        pg: await getQueryBuilder(),
    };
}
