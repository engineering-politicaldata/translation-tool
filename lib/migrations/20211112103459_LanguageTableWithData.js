exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        SET search_path TO ${schema};
        DROP EXTENSION IF EXISTS "uuid-ossp";

        CREATE EXTENSION "uuid-ossp" SCHEMA ${schema};
        create table if not exists ${schema}.language (
            id uuid not null default uuid_generate_v4(),
            code text not null,
            name text not null,
            constraint language_pk primary key (id)
        );
        
        
        insert into "${schema}"."language"
        (id, code, name)
        values
        (uuid_generate_v4(), 'en', 'English'),
        (uuid_generate_v4(), 'es', 'Spanish'),
        (uuid_generate_v4(), 'fr', 'French');

        SET search_path TO public;
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    DROP TABLE IF EXISTS ${schema}.language
  `);
};
