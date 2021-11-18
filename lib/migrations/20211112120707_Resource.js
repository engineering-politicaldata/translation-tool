exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        SET search_path TO ${schema};
        
        create table if not exists ${schema}.resource (
            id uuid not null default uuid_generate_v4(),
            id_project uuid not null,
            resource_name text not null,
            created timestamp with time zone not null default now(), 
            updated timestamp with time zone,
            constraint resource_pk primary key (id),
            constraint resouce_project_fk foreign key (id_project) references ${schema}.project(id)
        );

        SET search_path TO public;
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    DROP TABLE IF EXISTS ${schema}.resource
  `);
};
