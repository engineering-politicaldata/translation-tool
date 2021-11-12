exports.up = async function (knex) {
    const schema = process.env.DB_SCHEMA || 'translation';

    return knex.schema.raw(`
        create table if not exists ${schema}.project__language (
            id_project uuid not null,
            id_language uuid not null,
            is_source_language boolean default false,
            constraint project__language_pk primary key (id_project, id_language)
        );
    `);
};

exports.down = function (knex) {
    return knex.schema.raw(`
    DROP TABLE IF EXISTS ${schema}.project__language
  `);
};
