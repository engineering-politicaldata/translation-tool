exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        SET search_path TO ${schema};
        
        create table if not exists ${schema}.project (
            id uuid not null default uuid_generate_v4(),
            name text not null,
            description text not null,
            created timestamp with time zone not null default now(), 
            updated timestamp with time zone,
            constraint project_pk primary key (id)
        );

        SET search_path TO public;
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    DROP TABLE IF EXISTS ${schema}.project
  `);
};
