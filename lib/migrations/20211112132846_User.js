exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        SET search_path TO ${schema};
        
        create table if not exists ${schema}.user (
            id uuid not null default uuid_generate_v4(),
            email text not null,
            password text,
            first_name text,
            last_name text,
            created timestamp with time zone not null default now(), 
            updated timestamp with time zone,
            constraint user_pk primary key (id),
            constraint email_uc unique (email)
        );

        SET search_path TO public;
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    DROP TABLE IF EXISTS ${schema}.user
  `);
};
