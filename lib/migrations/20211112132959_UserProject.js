exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        SET search_path TO ${schema};
        
        create table if not exists ${schema}.user__project (
            id_user uuid not null,
            id_project uuid not null,
            created timestamp with time zone not null default now(), 
            constraint user__project_pk primary key (id_user, id_project),
            constraint user__project_user_fk foreign key (id_user) references ${schema}.user(id),
            constraint user__project_project_fk foreign key (id_project) references ${schema}.project(id)
        );

        SET search_path TO public;
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    DROP TABLE IF EXISTS ${schema}.user__project
  `);
};
