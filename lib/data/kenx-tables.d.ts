import { knex } from 'knex';

declare module 'knex/types/tables' {
    interface Project {
        id: string;
        name: string;
        description: string;
        created: any;
        updated: any;
    }

    interface Tables {
        // This is same as specifying `knex<Project>('project')`
        project: Project;
    }
}
